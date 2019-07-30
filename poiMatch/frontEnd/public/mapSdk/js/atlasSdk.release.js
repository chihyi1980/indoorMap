/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

/**
 * Generic animation class with support for dropped frames both optional easing and duration.
 *
 * Optional duration is useful when the lifetime is defined by another condition than time
 * e.g. speed of an animating object, etc.
 *
 * Dropped frame logic allows to keep using the same updater logic independent from the actual
 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
 * based on the pure time difference.
 */
(function(global) {
    var time = Date.now || function() {
        return +new Date();
    };
    var desiredFrames = 60;
    var millisecondsPerSecond = 1000;
    var running = {};
    var counter = 1;

    // Create namespaces
    if (!global.core) {
        global.core = { effect : {} };

    } else if (!core.effect) {
        core.effect = {};
    }

    core.effect.Animate = {

        /**
         * A requestAnimationFrame wrapper / polyfill.
         *
         * @param callback {Function} The callback to be invoked before the next repaint.
         * @param root {HTMLElement} The root element for the repaint
         */
        requestAnimationFrame: (function() {

            // Check for request animation Frame support
            var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
            var isNative = !!requestFrame;

            if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
                isNative = false;
            }

            if (isNative) {
                return function(callback, root) {
                    requestFrame(callback, root)
                };
            }

            var TARGET_FPS = 60;
            var requests = {};
            var requestCount = 0;
            var rafHandle = 1;
            var intervalHandle = null;
            var lastActive = +new Date();

            return function(callback, root) {
                var callbackHandle = rafHandle++;

                // Store callback
                requests[callbackHandle] = callback;
                requestCount++;

                // Create timeout at first request
                if (intervalHandle === null) {

                    intervalHandle = setInterval(function() {

                        var time = +new Date();
                        var currentRequests = requests;

                        // Reset data structure before executing callbacks
                        requests = {};
                        requestCount = 0;

                        for(var key in currentRequests) {
                            if (currentRequests.hasOwnProperty(key)) {
                                currentRequests[key](time);
                                lastActive = time;
                            }
                        }

                        // Disable the timeout when nothing happens for a certain
                        // period of time
                        if (time - lastActive > 2500) {
                            clearInterval(intervalHandle);
                            intervalHandle = null;
                        }

                    }, 1000 / TARGET_FPS);
                }

                return callbackHandle;
            };

        })(),


        /**
         * Stops the given animation.
         *
         * @param id {Integer} Unique animation ID
         * @return {Boolean} Whether the animation was stopped (aka, was running before)
         */
        stop: function(id) {
            var cleared = running[id] != null;
            if (cleared) {
                running[id] = null;
            }

            return cleared;
        },


        /**
         * Whether the given animation is still running.
         *
         * @param id {Integer} Unique animation ID
         * @return {Boolean} Whether the animation is still running
         */
        isRunning: function(id) {
            return running[id] != null;
        },


        /**
         * Start the animation.
         *
         * @param stepCallback {Function} Pointer to function which is executed on every step.
         *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
         * @param verifyCallback {Function} Executed before every animation step.
         *   Signature of the method should be `function() { return continueWithAnimation; }`
         * @param completedCallback {Function}
         *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
         * @param duration {Integer} Milliseconds to run the animation
         * @param easingMethod {Function} Pointer to easing function
         *   Signature of the method should be `function(percent) { return modifiedValue; }`
         * @param root {Element ? document.body} Render root, when available. Used for internal
         *   usage of requestAnimationFrame.
         * @return {Integer} Identifier of animation. Can be used to stop it any time.
         */
        start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {

            var start = time();
            var lastFrame = start;
            var percent = 0;
            var dropCounter = 0;
            var id = counter++;

            if (!root) {
                root = document.body;
            }

            // Compacting running db automatically every few new animations
            if (id % 20 === 0) {
                var newRunning = {};
                for (var usedId in running) {
                    newRunning[usedId] = true;
                }
                running = newRunning;
            }

            // This is the internal step method which is called every few milliseconds
            var step = function(virtual) {

                // Normalize virtual value
                var render = virtual !== true;

                // Get current time
                var now = time();

                // Verification is executed before next animation step
                if (!running[id] || (verifyCallback && !verifyCallback(id))) {

                    running[id] = null;
                    completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
                    return;

                }

                // For the current rendering to apply let's update omitted steps in memory.
                // This is important to bring internal state variables up-to-date with progress in time.
                if (render) {

                    var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
                    for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
                        step(true);
                        dropCounter++;
                    }

                }

                // Compute percent value
                if (duration) {
                    percent = (now - start) / duration;
                    if (percent > 1) {
                        percent = 1;
                    }
                }

                // Execute step callback, then...
                var value = easingMethod ? easingMethod(percent) : percent;
                if ((stepCallback(value, now, render) === false || percent === 1) && render) {
                    running[id] = null;
                    completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
                } else if (render) {
                    lastFrame = now;
                    core.effect.Animate.requestAnimationFrame(step, root);
                }
            };

            // Mark as running
            running[id] = true;

            // Init first step
            core.effect.Animate.requestAnimationFrame(step, root);

            // Return unique animation ID
            return id;
        }
    };
})(this);


var Scroller;

(function() {
    var NOOP = function(){};

    /**
     * A pure logic 'component' for 'virtual' scrolling/zooming.
     */
    Scroller = function(callback, options) {

        this.__callback = callback.zoom;
        this.__rotateCallback = callback.rotate;

        this.options = {

            /** Enable scrolling on x-axis */
            //useless
            scrollingX: true,

            //useless
            /** Enable scrolling on y-axis */
            scrollingY: true,

            /** Enable animations for deceleration, snap back, zooming and scrolling */
            animating: true,

            /** duration for animations triggered by scrollTo/zoomTo */
            animationDuration: 250,

            /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
            bouncing: true,

            /** Enable locking to the main axis if user moves only slightly on one of them at start */
            locking: true,

            /** Enable pagination mode (switching between full page content panes) */
            paging: false,

            /** Enable snapping of content to a configured pixel grid */
            snapping: false,

            //important
            /** Enable zooming of content via API, fingers and mouse wheel */
            zooming: true,

            /** Minimum zoom level */
            minZoom: 1,

            /** Maximum zoom level */
            maxZoom: 20,

            /** Multiply or decrease scrolling speed **/
            speedMultiplier: 1,

            /** Callback that is fired on the later of touch end or deceleration end,
             provided that another scrolling action has not begun. Used to know
             when to fade out a scrollbar. */
            scrollingComplete: NOOP,

            /** This configures the amount of change applied to deceleration when reaching boundaries  **/
            penetrationDeceleration : 0.03,

            /** This configures the amount of change applied to acceleration when reaching boundaries  **/
            penetrationAcceleration : 0.08,

            zoomContent : null,

            mapContent: null,

            rotateContent : null
        };

        //覆盖初始参数
        for (var key in options) {
            this.options[key] = options[key];
        }

    };


    // Easing Equations (c) 2003 Robert Penner, all rights reserved.
    // Open source under the BSD License.
    //大概是一个动画效果的算法，先快中间慢后快，类似的
    /**
     * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
     **/
    var easeOutCubic = function(pos) {
        return (Math.pow((pos - 1), 3) + 1);
    };

    /**
     * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
     **/
    var easeInOutCubic = function(pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 3);
        }

        return 0.5 * (Math.pow((pos - 2), 3) + 2);
    };


    //成员变量
    var members = {

        /*
         ---------------------------------------------------------------------------
         INTERNAL FIELDS :: STATUS
         ---------------------------------------------------------------------------
         */

        /** {Boolean} Whether only a single finger is used in touch handling */
        __isSingleTouch: false,

        /** {Boolean} Whether a touch event sequence is in progress */
        __isTracking: false,

        /** {Boolean} Whether a deceleration animation went to completion. */
        __didDecelerationComplete: false,

        /**
         * {Boolean} Whether a gesture zoom/rotate event is in progress. Activates when
         * a gesturestart event happens. This has higher priority than dragging.
         */
        //缩放和旋转操作有比拖动更高的优先级
        __isGesturing: false,

        /**
         * {Boolean} Whether the user has moved by such a distance that we have enabled
         * dragging mode. Hint: It's only enabled after some pixels of movement to
         * not interrupt with clicks etc.
         */
        __isDragging: false,

        /**
         * {Boolean} Not touching and dragging anymore, and smoothly animating the
         * touch sequence using deceleration.
         */
        __isDecelerating: false,

        /**
         * {Boolean} Smoothly animating the currently configured change
         */
        __isAnimating: false,



        /*
         ---------------------------------------------------------------------------
         INTERNAL FIELDS :: DIMENSIONS
         ---------------------------------------------------------------------------
         */

        /** {Integer} Available outer left position (from document perspective) */
        __clientLeft: 0,

        /** {Integer} Available outer top position (from document perspective) */
        __clientTop: 0,

        /** {Integer} Available outer width */
        __clientWidth: 0,

        /** {Integer} Available outer height */
        __clientHeight: 0,

        /** {Integer} Outer width of content */
        __contentWidth: 0,

        /** {Integer} Outer height of content */
        __contentHeight: 0,

        /** {Integer} Snapping width for content */
        __snapWidth: 100,

        /** {Integer} Snapping height for content */
        __snapHeight: 100,


        //useless
        /** {Integer} Height to assign to refresh area */
        __refreshHeight: null,
        //useless
        /** {Boolean} Whether the refresh process is enabled when the event is released now */
        __refreshActive: false,
        //useless
        /** {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release */
        __refreshActivate: null,
        //useless
        /** {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled */
        __refreshDeactivate: null,
        //useless
        /** {Function} Callback to execute to start the actual refresh. Call {@link #refreshFinish} when done */
        __refreshStart: null,

        /** {Number} Zoom level */
        __zoomLevel: 1,

        /** {Number} Scroll position on x-axis */
        __scrollLeft: 0,

        /** {Number} Scroll position on y-axis */
        __scrollTop: 0,

        /** {Integer} Maximum allowed scroll position on x-axis */
        __maxScrollLeft: 0,

        /** {Integer} Maximum allowed scroll position on y-axis */
        __maxScrollTop: 0,

        /** {Number} Scheduled left position (final position when animating) */
        __scheduledLeft: 0,

        /** {Number} Scheduled top position (final position when animating) */
        __scheduledTop: 0,

        /** {Number} Scheduled zoom level (final scale when animating) */
        __scheduledZoom: 0,



        /*
         ---------------------------------------------------------------------------
         INTERNAL FIELDS :: LAST POSITIONS
         ---------------------------------------------------------------------------
         */

        /** {Number} Left position of finger at start */
        __lastTouchLeft: null,

        /** {Number} Top position of finger at start */
        __lastTouchTop: null,

        /** {Date} Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
        __lastTouchMove: null,

        /** {Array} List of positions, uses three indexes for each state: left, top, timestamp */
        __positions: null,



        /*
         ---------------------------------------------------------------------------
         INTERNAL FIELDS :: DECELERATION SUPPORT
         ---------------------------------------------------------------------------
         */

        /** {Integer} Minimum left scroll position during deceleration */
        __minDecelerationScrollLeft: null,

        /** {Integer} Minimum top scroll position during deceleration */
        __minDecelerationScrollTop: null,

        /** {Integer} Maximum left scroll position during deceleration */
        __maxDecelerationScrollLeft: null,

        /** {Integer} Maximum top scroll position during deceleration */
        __maxDecelerationScrollTop: null,

        /** {Number} Current factor to modify horizontal scroll position with on every step */
        __decelerationVelocityX: null,

        /** {Number} Current factor to modify vertical scroll position with on every step */
        __decelerationVelocityY: null,

        /*add by zhaop for rotation*/
        __rotateDegree : 0,

        __degrees: null,

        __lastRotation: 0,

        __rotatePointRate: 1,

        __curPosition: null,

        __centerPosition: null,



        /*
         ---------------------------------------------------------------------------
         PUBLIC API
         ---------------------------------------------------------------------------
         */

        /**
         * Configures the dimensions of the client (outer) and content (inner) elements.
         * Requires the available space for the outer element and the outer size of the inner element.
         * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
         *
         * @param clientWidth {Integer ? null} Inner width of outer element
         * @param clientHeight {Integer ? null} Inner height of outer element
         * @param contentWidth {Integer ? null} Outer width of inner element
         * @param contentHeight {Integer ? null} Outer height of inner element
         */

        //一开始需要调用来确定内外层元素宽高，client代表外层，content代表内层
        //TODO: 自动获取内外层元素宽高
        setDimensions: function(clientWidth, clientHeight, contentWidth, contentHeight) {

            var self = this;

            // Only update values which are defined
            //能判断0吗？
            if (clientWidth === +clientWidth) {
                self.__clientWidth = clientWidth;
            }

            if (clientHeight === +clientHeight) {
                self.__clientHeight = clientHeight;
            }

            if (contentWidth === +contentWidth) {
                self.__contentWidth = contentWidth;
            }

            if (contentHeight === +contentHeight) {
                self.__contentHeight = contentHeight;
            }

            // Refresh maximums
            self.__computeScrollMax();

            // Refresh scroll position
            self.scrollTo(self.__scrollLeft, self.__scrollTop, true);

        },


        /**
         * Sets the client coordinates in relation to the document.
         *
         * @param left {Integer ? 0} Left position of outer element
         * @param top {Integer ? 0} Top position of outer element
         */
        //设置外层元素坐标
        //TODO 用DOM获取
        setPosition: function(left, top) {
            var self = this;

            self.__clientLeft = left || 0;
            self.__clientTop = top || 0;

        },


        /**
         * Configures the snapping (when snapping is active)
         *
         * @param width {Integer} Snapping width
         * @param height {Integer} Snapping height
         */

        //WTF??
        setSnapSize: function(width, height) {

            var self = this;

            self.__snapWidth = width;
            self.__snapHeight = height;

        },


        /**
         * Activates pull-to-refresh. A special zone on the top of the list to start a list refresh whenever
         * the user event is released during visibility of this zone. This was introduced by some apps on iOS like
         * the official Twitter client.
         *
         * @param height {Integer} Height of pull-to-refresh zone on top of rendered list
         * @param activateCallback {Function} Callback to execute on activation. This is for signalling the user about a refresh is about to happen when he release.
         * @param deactivateCallback {Function} Callback to execute on deactivation. This is for signalling the user about the refresh being cancelled.
         * @param startCallback {Function} Callback to execute to start the real async refresh action. Call {@link #finishPullToRefresh} after finish of refresh.
         */
        //useless
        activatePullToRefresh: function(height, activateCallback, deactivateCallback, startCallback) {

            var self = this;

            self.__refreshHeight = height;
            self.__refreshActivate = activateCallback;
            self.__refreshDeactivate = deactivateCallback;
            self.__refreshStart = startCallback;

        },


        /**
         * Starts pull-to-refresh manually.
         */
        //useless
        triggerPullToRefresh: function() {
            // Use publish instead of scrollTo to allow scrolling to out of boundary position
            // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
            this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, true);

            if (this.__refreshStart) {
                this.__refreshStart();
            }
        },


        /**
         * Signalizes that pull-to-refresh is finished.
         */
        //useless
        finishPullToRefresh: function() {

            var self = this;

            self.__refreshActive = false;
            if (self.__refreshDeactivate) {
                self.__refreshDeactivate();
            }

            self.scrollTo(self.__scrollLeft, self.__scrollTop, true);

        },


        /**
         * Returns the scroll position and zooming values
         *
         * @return {Map} `left` and `top` scroll position and `zoom` level
         */
        getValues: function() {

            var self = this;

            return {
                left: self.__scrollLeft,
                top: self.__scrollTop,
                zoom: self.__zoomLevel
            };

        },


        /**
         * Returns the maximum scroll values
         *
         * @return {Map} `left` and `top` maximum scroll values
         */
        getScrollMax: function() {

            var self = this;

            return {
                left: self.__maxScrollLeft,
                top: self.__maxScrollTop
            };

        },

        rotateTo: function(degree, offsetLeft, offsetTop, callback){
            var self = this;

            if (!self.options.zooming) {
                throw new Error("Zooming is not enabled!");
            }

            if(callback) {
                self.__zoomComplete = callback;
            }

            if (self.__isDecelerating) {
                core.effect.Animate.stop(self.__isDecelerating);
                self.__isDecelerating = false;
            }

            var oldLevel = self.__zoomLevel,
                level = self.__zoomLevel;

            if (offsetLeft == null) {
                offsetLeft = 0;
            }

            if (offsetTop == null) {
                offsetTop = 0;
            }

            self.scrollBy(offsetLeft, offsetTop, false);

            //self.__scheduledLeft = self.__scrollLeft;
            //self.__scheduledTop = self.__scrollTop;
            //self.__scheduledZoom = self.__zoomLevel = level;

            if (self.options.zooming) {
                self.__computeScrollMax();
                if(self.__zoomComplete) {
                    self.__zoomComplete();
                    self.__zoomComplete = null;
                }
                if (self.__onZoomingFunc) {
                    self.__onZoomingFunc();
                }
            }

            if(self.__rotateCallback && self.options.rotateContent){
                self.__rotateCallback(self.options.rotateContent, degree);
            }
        },


        /**
         * Zooms to the given level. Supports optional animation. Zooms
         * the center when no coordinates are given.
         *
         * @param level {Number} Level to zoom to
         * @param animate {Boolean ? false} Whether to use animation
         * @param originLeft {Number ? null} Zoom in at given left coordinate
         * @param originTop {Number ? null} Zoom in at given top coordinate
         * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
         */
        zoomTo: function(level, animate, originLeft, originTop, callback) {

            var self = this;

            if (!self.options.zooming) {
                throw new Error("Zooming is not enabled!");
            }

            // Add callback if exists
            if(callback) {
                self.__zoomComplete = callback;
            }

            // Stop deceleration
            if (self.__isDecelerating) {
                //WTF??
                core.effect.Animate.stop(self.__isDecelerating);
                self.__isDecelerating = false;
            }

            var oldLevel = self.__zoomLevel;

            // Normalize input origin to center of viewport if not defined
            if (originLeft == null) {
                originLeft = self.__clientWidth / 2;
            }

            if (originTop == null) {
                originTop = self.__clientHeight / 2;
            }

            // Limit level according to configuration
            //闲置level层级
            level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

            // Recompute maximum values while temporary tweaking maximum scroll ranges
            self.__computeScrollMax(level);

            // Recompute left and top coordinates based on new zoom level
            var left = ((originLeft + self.__scrollLeft) * level / oldLevel) - originLeft;
            var top = ((originTop + self.__scrollTop) * level / oldLevel) - originTop;

            // Limit x-axis
            if (left > self.__maxScrollLeft) {
                left = self.__maxScrollLeft;
            } else if (left < 0) {
                left = 0;
            }

            // Limit y-axis
            if (top > self.__maxScrollTop) {
                top = self.__maxScrollTop;
            } else if (top < 0) {
                top = 0;
            }
            // Push values out
            //进行运动的参数调整，并且运行结束时的callback，并返回关键参数
            self.__publish(left, top, level, animate);

        },


        /**
         * Zooms the content by the given factor.
         *
         * @param factor {Number} Zoom by given factor
         * @param animate {Boolean ? false} Whether to use animation
         * @param originLeft {Number ? 0} Zoom in at given left coordinate
         * @param originTop {Number ? 0} Zoom in at given top coordinate
         * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
         */
        //放大缩小倍数
        zoomBy: function(factor, animate, originLeft, originTop, callback) {

            var self = this;

            self.zoomTo(self.__zoomLevel * factor, animate, originLeft, originTop, callback);

        },


        /**
         * Scrolls to the given position. Respect limitations and snapping automatically.
         *
         * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
         * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
         * @param animate {Boolean?false} Whether the scrolling should happen using an animation
         * @param zoom {Number?null} Zoom level to go to
         */
        //useless
        scrollTo: function(left, top, animate, zoom) {
            var self = this;
            // Stop deceleration
            if (self.__isDecelerating) {
                core.effect.Animate.stop(self.__isDecelerating);
                self.__isDecelerating = false;
            }
            // Correct coordinates based on new zoom level
            if (zoom != null && zoom !== self.__zoomLevel) {

                if (!self.options.zooming) {
                    throw new Error("Zooming is not enabled!");
                }

                left *= zoom;
                top *= zoom;

                // Recompute maximum values while temporary tweaking maximum scroll ranges
                self.__computeScrollMax(zoom);

            } else {

                // Keep zoom when not defined
                zoom = self.__zoomLevel;

            }


            if (!self.options.scrollingX) {

                left = self.__scrollLeft;

            } else {

                if (self.options.paging) {
                    left = Math.round(left / self.__clientWidth) * self.__clientWidth;
                } else if (self.options.snapping) {
                    left = Math.round(left / self.__snapWidth) * self.__snapWidth;
                }
            }
            if (!self.options.scrollingY) {

                top = self.__scrollTop;

            } else {

                if (self.options.paging) {
                    top = Math.round(top / self.__clientHeight) * self.__clientHeight;
                } else if (self.options.snapping) {
                    top = Math.round(top / self.__snapHeight) * self.__snapHeight;
                }

            }

            // Limit for allowed ranges
            //left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
            //top = Math.max(Math.min(self.__maxScrollTop, top), 0);
            left = Math.min(self.__maxScrollLeft, left);
            top = Math.min(self.__maxScrollTop, top);
            // Don't animate when no change detected, still call publish to make sure
            // that rendered position is really in-sync with internal data
            if (left === self.__scrollLeft && top === self.__scrollTop) {
                animate = false;
            }
            // Publish new values
            self.__publish(left, top, zoom, animate);
        },


        /**
         * Scroll by the given offset
         *
         * @param left {Number ? 0} Scroll x-axis by given offset
         * @param top {Number ? 0} Scroll x-axis by given offset
         * @param animate {Boolean ? false} Whether to animate the given change
         */
        //useless
        scrollBy: function(left, top, animate) {

            var self = this;

            var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
            var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;

            self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);

        },



        /*
         ---------------------------------------------------------------------------
         EVENT CALLBACKS
         ---------------------------------------------------------------------------
         */

        /**
         * Mouse wheel handler for zooming support
         */
        //TODO: 自动调用
        doMouseZoom: function(wheelDelta, timeStamp, pageX, pageY, tapScale) {

            var self = this;
            var change;
            if(tapScale){
                change = tapScale;
            }else{
                change = wheelDelta > 0 ? 0.9 : 1.1;
            }
            return self.zoomTo(self.__zoomLevel * change, false, pageX - self.__clientLeft, pageY - self.__clientTop, self.options.scrollingComplete);

        },
        /**
         * 鼠标滚轮旋转地图，by zhaop
         */

        doMouseRotate: function(wheelDelta, timeStamp, offsetX, offsetY) {

            var self = this;
            var change = wheelDelta > 0 ? (self.__rotateDegree + 10) % 360  : (self.__rotateDegree + 350) % 360;
            self.__rotateDegree = change;
            return self.rotateTo(self.__rotateDegree, null, null, self.options.scrollingComplete);
        },

        doRotateStart: function(center, rotation, timeStamp){
            if (!center) {
                throw new Error("Invalid touch : " + center);
            }
            if (timeStamp instanceof Date) {
                timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
                throw new Error("Invalid timestamp value: " + timeStamp);
            }

            var self = this;
            var curPosition = {
                x: parseInt(center.x + self.__scrollLeft),
                y: parseInt(center.y + self.__scrollTop)
            };
            var centerPosition = {
                x: parseInt(self.__contentWidth * self.__zoomLevel / 2),
                y: parseInt(self.__contentHeight * self.__zoomLevel / 2)
            };

            self.__degrees = [];
            self.__scrollOffsets = [];

            self.__curPosition = curPosition;
            self.__centerPosition = centerPosition;

            self.__lastRotation = parseInt(rotation);

            self.__degrees.push(self.__lastRotation, timeStamp);
            self.__scrollOffsets.push(0, 0 , timeStamp);
        },

        doTouchRotate: function(evt){
            if (evt.pointers.length == null) {
                throw new Error("Invalid touch list: " + touches);
            }
            var timeStamp = evt.timeStamp;
            if (timeStamp instanceof Date) {
                timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
                throw new Error("Invalid timestamp value: " + timeStamp);
            }

            var  self = this;

            var rotation = evt.rotation;

            var degrees = self.__degrees;
            var scrollOffsets = self.__scrollOffsets;

            var deltaDegree = parseInt(rotation) - self.__lastRotation;

            if(Math.abs(deltaDegree) < 5){
                return;
            }else{
                var change = (parseInt(deltaDegree + self.__rotateDegree ) % 360);

                var getRotatedPoint = function(center, point, deltaDeg){
                    var r = Math.sqrt((center.x - point.x) * (center.x - point.x) +  (center.y - point.y) * (center.y - point.y));
                    var deg, k, res, radian;
                    if(r != 0){
                        if(center.x == point.x){
                            if(center.y < point.y){
                                deg = 90 + deltaDeg;
                            }else{
                                deg = 270 + deltaDeg;
                            }
                        }else{
                            k = (center.y - point.y) / (center.x - point.x);
                            if((center.x > point.x && center.y > point.y) || (center.x > point.x && center.y < point.y)){
                                deg = Math.atan(k) * 180  / Math.PI + 180 + deltaDeg;
                            }
                            if((center.x < point.x && center.y < point.y) || (center.x < point.x && center.y > point.y)){
                                deg = Math.atan(k) * 180  / Math.PI + deltaDeg;
                            }
                        }
                        radian = deg * Math.PI / 180;
                        res = {
                            x: r * Math.cos(radian) + center.x,
                            y: r * Math.sin(radian) + center.y
                        };
                        return res;
                    }else{
                        return res = center;
                    }
                };

                self.__rotateDegree = change;
                if (degrees.length > 40) {
                    degrees.splice(0, 20);
                }
                degrees.push(parseInt(rotation), timeStamp);

                var lastPos = degrees.length - 2;
                self.__lastRotation = degrees[lastPos];
                var offsetPoint = getRotatedPoint(self.__centerPosition, self.__curPosition, deltaDegree);
                var offsetLeft = parseInt((offsetPoint.x - self.__curPosition.x) * 100) / 100;
                var offsetTop = parseInt((offsetPoint.y - self.__curPosition.y) * 100) / 100;
                self.__curPosition = offsetPoint;
                return self.rotateTo(self.__rotateDegree, offsetLeft, offsetTop, self.options.scrollingComplete);
            }
        },
        /**
         * Touch start handler for scrolling support
         */
        doTouchStart: function(touches, timeStamp) {
            // Array-like check is enough here
            if (touches.length == null) {
                throw new Error("Invalid touch list: " + touches);
            }

            if (timeStamp instanceof Date) {
                timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
                throw new Error("Invalid timestamp value: " + timeStamp);
            }

            var self = this;

            // Reset interruptedAnimation flag
            self.__interruptedAnimation = true;

            // Stop deceleration
            if (self.__isDecelerating) {
                core.effect.Animate.stop(self.__isDecelerating);
                self.__isDecelerating = false;
                self.__interruptedAnimation = true;
            }

            // Stop animation
            if (self.__isAnimating) {
                core.effect.Animate.stop(self.__isAnimating);
                self.__isAnimating = false;
                self.__interruptedAnimation = true;
            }

            // Use center point when dealing with two fingers
            var currentTouchLeft, currentTouchTop;
            var isSingleTouch = touches.length === 1;
            if (isSingleTouch) {
                currentTouchLeft = touches[0].pageX;
                currentTouchTop = touches[0].pageY;
            } else {
                currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
                currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
            }

            // Store initial positions
            self.__initialTouchLeft = currentTouchLeft;
            self.__initialTouchTop = currentTouchTop;

            // Store current zoom level
            self.__zoomLevelStart = self.__zoomLevel;

            // Store initial touch positions
            self.__lastTouchLeft = currentTouchLeft;
            self.__lastTouchTop = currentTouchTop;

            // Store initial move time stamp
            self.__lastTouchMove = timeStamp;

            // Reset initial scale
            self.__lastScale = 1;

            // Reset locking flags
            self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
            self.__enableScrollY = !isSingleTouch && self.options.scrollingY;

            // Reset tracking flag
            self.__isTracking = true;

            // Reset deceleration complete flag
            self.__didDecelerationComplete = false;

            // Dragging starts directly with two fingers, otherwise lazy with an offset
            self.__isDragging = !isSingleTouch;

            // Some features are disabled in multi touch scenarios
            self.__isSingleTouch = isSingleTouch;

            // Clearing data structure
            self.__positions = [];

        },


        /**
         * Touch move handler for scrolling support
         */
        doTouchMove: function(touches, timeStamp, scale) {

            // Array-like check is enough here
            if (touches.length == null) {
                throw new Error("Invalid touch list: " + touches);
            }

            if (timeStamp instanceof Date) {
                timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
                throw new Error("Invalid timestamp value: " + timeStamp);
            }

            var self = this;

            // Ignore event when tracking is not enabled (event might be outside of element)
            if (!self.__isTracking) {
                return;
            }

            var currentTouchLeft, currentTouchTop;

            // Compute move based around of center of fingers
            if (touches.length === 2) {
                currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
                currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
            } else {
                currentTouchLeft = touches[0].pageX;
                currentTouchTop = touches[0].pageY;
            }

            var positions = self.__positions;

            // Are we already is dragging mode?
            if (self.__isDragging) {

                // Compute move distance
                var moveX = currentTouchLeft - self.__lastTouchLeft;
                var moveY = currentTouchTop - self.__lastTouchTop;

                // Read previous scroll position and zooming
                var scrollLeft = self.__scrollLeft;
                var scrollTop = self.__scrollTop;
                var level = self.__zoomLevel;

                // Work with scaling
                if (scale != null && self.options.zooming) {

                    var oldLevel = level;

                    // Recompute level based on previous scale and new scale
                    level = level / self.__lastScale * scale;

                    // Limit level according to configuration
                    level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);

                    // Only do further compution when change happened
                    if (oldLevel !== level) {

                        // Compute relative event position to container
                        var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
                        var currentTouchTopRel = currentTouchTop - self.__clientTop;

                        // Recompute left and top coordinates based on new zoom level
                        scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
                        scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;

                        // Recompute max scroll values
                        self.__computeScrollMax(level);

                    }
                }

                if (self.__enableScrollX) {

                    scrollLeft -= moveX * this.options.speedMultiplier;
                    var maxScrollLeft = self.__maxScrollLeft;

                    if (scrollLeft > maxScrollLeft || scrollLeft < 0) {

                        // Slow down on the edges
                        if (self.options.bouncing) {

                            scrollLeft += (moveX / 2  * this.options.speedMultiplier);

                        } else if (scrollLeft > maxScrollLeft) {

                            scrollLeft = maxScrollLeft;

                        } else {

                            scrollLeft = 0;

                        }
                    }
                }

                // Compute new vertical scroll position
                if (self.__enableScrollY) {

                    scrollTop -= moveY * this.options.speedMultiplier;
                    var maxScrollTop = self.__maxScrollTop;

                    if (scrollTop > maxScrollTop || scrollTop < 0) {

                        // Slow down on the edges
                        if (self.options.bouncing) {

                            scrollTop += (moveY / 2 * this.options.speedMultiplier);

                            // Support pull-to-refresh (only when only y is scrollable)
                            if (!self.__enableScrollX && self.__refreshHeight != null) {

                                if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {

                                    self.__refreshActive = true;
                                    if (self.__refreshActivate) {
                                        self.__refreshActivate();
                                    }

                                } else if (self.__refreshActive && scrollTop > -self.__refreshHeight) {

                                    self.__refreshActive = false;
                                    if (self.__refreshDeactivate) {
                                        self.__refreshDeactivate();
                                    }

                                }
                            }

                        } else if (scrollTop > maxScrollTop) {

                            scrollTop = maxScrollTop;

                        } else {

                            scrollTop = 0;

                        }
                    }
                }

                // Keep list from growing infinitely (holding min 10, max 20 measure points)
                if (positions.length > 60) {
                    positions.splice(0, 30);
                }

                // Track scroll movement for decleration
                positions.push(scrollLeft, scrollTop, timeStamp);

                // Sync scroll position
                self.__publish(scrollLeft, scrollTop, level);

                // Otherwise figure out whether we are switching into dragging mode now.
            } else {

                var minimumTrackingForScroll = self.options.locking ? 3 : 0;
                var minimumTrackingForDrag = 5;

                var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
                var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);

                self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
                self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;

                positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);

                self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);
                if (self.__isDragging) {
                    self.__interruptedAnimation = false;
                }

            }

            // Update last touch positions and time stamp for next event
            self.__lastTouchLeft = currentTouchLeft;
            self.__lastTouchTop = currentTouchTop;
            self.__lastTouchMove = timeStamp;
            self.__lastScale = scale;

        },


        /**
         * Touch end handler for scrolling support
         */
        doTouchEnd: function(timeStamp) {

            if (timeStamp instanceof Date) {
                timeStamp = timeStamp.valueOf();
            }
            if (typeof timeStamp !== "number") {
                throw new Error("Invalid timestamp value: " + timeStamp);
            }

            var self = this;

            // Ignore event when tracking is not enabled (no touchstart event on element)
            // This is required as this listener ('touchmove') sits on the document and not on the element itself.
            if (!self.__isTracking) {
                return;
            }

            // Not touching anymore (when two finger hit the screen there are two touch end events)
            self.__isTracking = false;

            // Be sure to reset the dragging flag now. Here we also detect whether
            // the finger has moved fast enough to switch into a deceleration animation.
            if (self.__isDragging) {

                // Reset dragging flag
                self.__isDragging = false;

                // Start deceleration
                // Verify that the last move detected was in some relevant time frame
                if (self.__isSingleTouch && self.options.animating && (timeStamp - self.__lastTouchMove) <= 100) {

                    // Then figure out what the scroll position was about 100ms ago
                    var positions = self.__positions;
                    var endPos = positions.length - 1;
                    var startPos = endPos;

                    // Move pointer to position measured 100ms ago
                    for (var i = endPos; i > 0 && positions[i] > (self.__lastTouchMove - 100); i -= 3) {
                        startPos = i;
                    }

                    // If start and stop position is identical in a 100ms timeframe,
                    // we cannot compute any useful deceleration.
                    if (startPos !== endPos) {

                        // Compute relative movement between these two points
                        var timeOffset = positions[endPos] - positions[startPos];
                        var movedLeft = self.__scrollLeft - positions[startPos - 2];
                        var movedTop = self.__scrollTop - positions[startPos - 1];

                        // Based on 50ms compute the movement to apply for each render step
                        self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
                        self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);

                        // How much velocity is required to start the deceleration
                        var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;

                        // Verify that we have enough velocity to start deceleration
                        if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {

                            // Deactivate pull-to-refresh when decelerating
                            if (!self.__refreshActive) {
                                self.__startDeceleration(timeStamp);
                            }
                        }
                    } else {
                        self.options.scrollingComplete();
                    }
                } else if ((timeStamp - self.__lastTouchMove) > 100) {
                    self.options.scrollingComplete();
                }
            }

            // If this was a slower move it is per default non decelerated, but this
            // still means that we want snap back to the bounds which is done here.
            // This is placed outside the condition above to improve edge case stability
            // e.g. touchend fired without enabled dragging. This should normally do not
            // have modified the scroll positions or even showed the scrollbars though.
            if (!self.__isDecelerating) {
                if (self.__refreshActive && self.__refreshStart) {

                    // Use publish instead of scrollTo to allow scrolling to out of boundary position
                    // We don't need to normalize scrollLeft, zoomLevel, etc. here because we only y-scrolling when pull-to-refresh is enabled
                    self.__publish(self.__scrollLeft, -self.__refreshHeight, self.__zoomLevel, true);

                    if (self.__refreshStart) {
                        self.__refreshStart();
                        //add by zhaop to test
                        self.options.scrollingComplete();
                    }

                } else {

                    if (self.__interruptedAnimation || self.__isDragging) {
                        self.options.scrollingComplete();
                    }
                    self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);

                    // Directly signalize deactivation (nothing todo on refresh?)
                    if (self.__refreshActive) {

                        self.__refreshActive = false;
                        if (self.__refreshDeactivate) {
                            self.__refreshDeactivate();
                            self.options.scrollingComplete();
                        }
                    }
                }
            }

            // Fully cleanup list
            self.__positions.length = 0;

        },



        /*
         ---------------------------------------------------------------------------
         PRIVATE API
         ---------------------------------------------------------------------------
         */

        /**
         * Applies the scroll position to the content element
         *
         * @param left {Number} Left scroll position
         * @param top {Number} Top scroll position
         * @param animate {Boolean?false} Whether animation should be used to move to the new coordinates
         */
        __publish: function(left, top, zoom, animate) {
            var self = this;

            left = Math.round(left);
            top = Math.round(top);
            zoom = Math.round(zoom * 1000) / 1000;
            // add by zhaop
            self.__zoomContent = self.options.mapContent;
            self.__diffZoom = zoom - self.__zoomLevel;

            // Remember whether we had an animation, then we try to continue based on the current "drive" of the animation
            var wasAnimating = self.__isAnimating;
            if (wasAnimating) {
                core.effect.Animate.stop(wasAnimating);
                self.__isAnimating = false;
            }
            if (animate && self.options.animating) {

                // Keep scheduled positions for scrollBy/zoomBy functionality
                self.__scheduledLeft = left;
                self.__scheduledTop = top;
                self.__scheduledZoom = zoom;

                var oldLeft = self.__scrollLeft;
                var oldTop = self.__scrollTop;
                var oldZoom = self.__zoomLevel;

                var diffLeft = left - oldLeft;
                var diffTop = top - oldTop;
                var diffZoom = zoom - oldZoom;

                var step = function(percent, now, render) {

                    if (render) {

                        self.__scrollLeft = oldLeft + (diffLeft * percent);
                        self.__scrollTop = oldTop + (diffTop * percent);
                        self.__zoomLevel = oldZoom + (diffZoom * percent);
                        // Push values out
                        if (self.__callback && self.__zoomContent) {
                            self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel, self.__zoomContent);
                        }

                    }
                };

                var verify = function(id) {
                    return self.__isAnimating === id;
                };

                var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
                    if (animationId === self.__isAnimating) {
                        self.__isAnimating = false;
                    }
                    if (self.__didDecelerationComplete || wasFinished) {
                        self.options.scrollingComplete();
                    }

                    if (self.options.zooming) {
                        self.__computeScrollMax();
                        if(self.__zoomComplete) {
                            self.__zoomComplete();
                            self.__zoomComplete = null;
                        }
                        if (self.__onZoomingFunc) {
                            self.__onZoomingFunc();
                        }
                    }
                };

                // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
                self.__isAnimating = core.effect.Animate.start(step, verify, completed, self.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);
            } else {
                self.__scheduledLeft = self.__scrollLeft = left;
                self.__scheduledTop = self.__scrollTop = top;
                self.__scheduledZoom = self.__zoomLevel = zoom;
                // Push values out
                if (self.__callback && self.__zoomContent) {
                    self.__callback(left, top, self.__zoomLevel, self.__zoomContent);

                }

                // Fix max scroll ranges
                if (self.options.zooming) {
                    self.__computeScrollMax();
                    if(self.__zoomComplete) {
                        self.__zoomComplete();
                        self.__zoomComplete = null;
                    }
                    if (self.__onZoomingFunc) {
                        self.__onZoomingFunc();
                    }
                }
            }
        },


        /**
         * Recomputes scroll minimum values based on client dimensions and content dimensions.
         */
        __computeScrollMax: function(zoomLevel) {

            var self = this;

            if (zoomLevel == null) {
                zoomLevel = self.__zoomLevel;
            }

            if(self.options.mapContent){
                self.options.mapContent.style['width'] = Math.round(self.__contentWidth * zoomLevel).toString() + 'px';
                self.options.mapContent.style['height'] = Math.round(self.__contentHeight * zoomLevel).toString() + 'px';
            }
            self.__maxScrollLeft = Math.max((self.__contentWidth * zoomLevel) - self.__clientWidth, 0);
            self.__maxScrollTop = Math.max((self.__contentHeight * zoomLevel) - self.__clientHeight, 0);

        },



        /*
         ---------------------------------------------------------------------------
         ANIMATION (DECELERATION) SUPPORT
         ---------------------------------------------------------------------------
         */

        /**
         * Called when a touch sequence end and the speed of the finger was high enough
         * to switch into deceleration mode.
         */
        __startDeceleration: function(timeStamp) {

            var self = this;

            if (self.options.paging) {

                var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
                var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
                var clientWidth = self.__clientWidth;
                var clientHeight = self.__clientHeight;

                // We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
                // Each page should have exactly the size of the client area.
                self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
                self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
                self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
                self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;

            } else {

                self.__minDecelerationScrollLeft = 0;
                self.__minDecelerationScrollTop = 0;
                self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
                self.__maxDecelerationScrollTop = self.__maxScrollTop;

            }

            // Wrap class method
            var step = function(percent, now, render) {
                self.__stepThroughDeceleration(render);
            };

            // How much velocity is required to keep the deceleration running
            var minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.1;

            // Detect whether it's still worth to continue animating steps
            // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
            var verify = function() {
                var shouldContinue = Math.abs(self.__decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
                if (!shouldContinue) {
                    self.__didDecelerationComplete = true;
                }
                return shouldContinue;
            };

            var completed = function(renderedFramesPerSecond, animationId, wasFinished) {
                self.__isDecelerating = false;
                if (self.__didDecelerationComplete) {
                    self.options.scrollingComplete();
                }

                // Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
                self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
            };

            // Start animation and switch on flag
            self.__isDecelerating = core.effect.Animate.start(step, verify, completed);

        },


        /**
         * Called on every step of the animation
         *
         * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
         */
        __stepThroughDeceleration: function(render) {

            var self = this;


            //
            // COMPUTE NEXT SCROLL POSITION
            //

            // Add deceleration to scroll position
            var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
            var scrollTop = self.__scrollTop + self.__decelerationVelocityY;


            //
            // HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
            //

            if (!self.options.bouncing) {

                var scrollLeftFixed = Math.max(Math.min(self.__maxDecelerationScrollLeft, scrollLeft), self.__minDecelerationScrollLeft);
                if (scrollLeftFixed !== scrollLeft) {
                    scrollLeft = scrollLeftFixed;
                    self.__decelerationVelocityX = 0;
                }

                var scrollTopFixed = Math.max(Math.min(self.__maxDecelerationScrollTop, scrollTop), self.__minDecelerationScrollTop);
                if (scrollTopFixed !== scrollTop) {
                    scrollTop = scrollTopFixed;
                    self.__decelerationVelocityY = 0;
                }

            }


            //
            // UPDATE SCROLL POSITION
            //

            if (render) {

                self.__publish(scrollLeft, scrollTop, self.__zoomLevel);

            } else {

                self.__scrollLeft = scrollLeft;
                self.__scrollTop = scrollTop;

            }


            //
            // SLOW DOWN
            //

            // Slow down velocity on every iteration
            if (!self.options.paging) {

                // This is the factor applied to every iteration of the animation
                // to slow down the process. This should emulate natural behavior where
                // objects slow down when the initiator of the movement is removed
                var frictionFactor = 0.95;

                self.__decelerationVelocityX *= frictionFactor;
                self.__decelerationVelocityY *= frictionFactor;

            }


            //
            // BOUNCING SUPPORT
            //

            if (self.options.bouncing) {

                var scrollOutsideX = 0;
                var scrollOutsideY = 0;

                // This configures the amount of change applied to deceleration/acceleration when reaching boundaries
                var penetrationDeceleration = self.options.penetrationDeceleration;
                var penetrationAcceleration = self.options.penetrationAcceleration;

                // Check limits
                if (scrollLeft < self.__minDecelerationScrollLeft) {
                    scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
                } else if (scrollLeft > self.__maxDecelerationScrollLeft) {
                    scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
                }

                if (scrollTop < self.__minDecelerationScrollTop) {
                    scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
                } else if (scrollTop > self.__maxDecelerationScrollTop) {
                    scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
                }

                // Slow down until slow enough, then flip back to snap position
                if (scrollOutsideX !== 0) {
                    if (scrollOutsideX * self.__decelerationVelocityX <= 0) {
                        self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
                    } else {
                        self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
                    }
                }

                if (scrollOutsideY !== 0) {
                    if (scrollOutsideY * self.__decelerationVelocityY <= 0) {
                        self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
                    } else {
                        self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
                    }
                }
            }
        }
    };

    // Copy over members to prototype
    for (var key in members) {
        Scroller.prototype[key] = members[key];
    }

})();
/*! Hammer.JS - v2.0.2 - 2014-07-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */


!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(k(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e,f;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0,f=a.length;f>e;e++)b.call(c,a[e],e,a);else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(a,b,c){for(var e=Object.keys(b),f=0,g=e.length;g>f;f++)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]);return a}function i(a,b){return h(a,b,!0)}function j(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&h(d,c)}function k(a,b){return function(){return a.apply(b,arguments)}}function l(a,b){return typeof a==hb?a.apply(b?b[0]||d:d,b):a}function m(a,b){return a===d?b:a}function n(a,b,c){g(r(b),function(b){a.addEventListener(b,c,!1)})}function o(a,b,c){g(r(b),function(b){a.removeEventListener(b,c,!1)})}function p(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function q(a,b){return a.indexOf(b)>-1}function r(a){return a.trim().split(/\s+/g)}function s(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0,e=a.length;e>d;d++)if(c&&a[d][c]==b||!c&&a[d]===b)return d;return-1}function t(a){return Array.prototype.slice.call(a,0)}function u(a,b,c){for(var d=[],e=[],f=0,g=a.length;g>f;f++){var h=b?a[f][b]:a[f];s(e,h)<0&&d.push(a[f]),e[f]=h}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function v(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0,h=fb.length;h>g;g++)if(c=fb[g],e=c?c+f:b,e in a)return e;return d}function w(){return lb++}function x(b,c){var d=this;this.manager=b,this.callback=c,this.element=b.element,this.target=b.options.inputTarget,this.domHandler=function(a){l(b.options.enable,[b])&&d.handler(a)},this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(a,this.evWin,this.domHandler)}function y(a){var b;return new(b=ob?M:pb?N:nb?P:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&vb&&d-e===0,g=b&(xb|yb)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=kb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY),b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,C(c,b);var j=a.element;p(b.srcEvent.target,j)&&(j=b.srcEvent.target),b.target=j}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===vb||f.eventType===xb)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=yb&&(i>ub||h.velocity===d)){var j=h.deltaX-b.deltaX,k=h.deltaY-b.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=jb(l.x)>jb(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;c++)b[c]={clientX:ib(a.pointers[c].clientX),clientY:ib(a.pointers[c].clientY)};return{timeStamp:kb(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:ib(a[0].clientX),y:ib(a[0].clientY)};for(var c=0,d=0,e=0;b>e;e++)c+=a[e].clientX,d+=a[e].clientY;return{x:ib(c/b),y:ib(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?zb:jb(a)>=jb(b)?a>0?Ab:Bb:b>0?Cb:Db}function H(a,b,c){c||(c=Hb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Hb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Ib)-I(a[1],a[0],Ib)}function K(a,b){return H(b[0],b[1],Ib)/H(a[0],a[1],Ib)}function L(){this.evEl=Kb,this.evWin=Lb,this.allow=!0,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Ob,this.evWin=Pb,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=Rb,this.targetIds={},x.apply(this,arguments)}function O(a,b){var c=t(a.touches),d=this.targetIds;if(b&(vb|wb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=t(a.targetTouches),h=t(a.changedTouches),i=[];if(b===vb)for(e=0,f=g.length;f>e;e++)d[g[e].identifier]=!0;for(e=0,f=h.length;f>e;e++)d[h[e].identifier]&&i.push(h[e]),b&(xb|yb)&&delete d[h[e].identifier];return i.length?[u(g.concat(i),"identifier",!0),i]:void 0}function P(){x.apply(this,arguments);var a=k(this.handler,this);this.touch=new N(this.manager,a),this.mouse=new L(this.manager,a)}function Q(a,b){this.manager=a,this.set(b)}function R(a){if(q(a,Xb))return Xb;var b=q(a,Yb),c=q(a,Zb);return b&&c?Yb+" "+Zb:b||c?b?Yb:Zb:q(a,Wb)?Wb:Vb}function S(a){this.id=w(),this.manager=null,this.options=i(a||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=$b,this.simultaneous={},this.requireFail=[]}function T(a){return a&dc?"cancel":a&bc?"end":a&ac?"move":a&_b?"start":""}function U(a){return a==Db?"down":a==Cb?"up":a==Ab?"left":a==Bb?"right":""}function V(a,b){var c=b.manager;return c?c.get(a):a}function W(){S.apply(this,arguments)}function X(){W.apply(this,arguments),this.pX=null,this.pY=null}function Y(){W.apply(this,arguments)}function Z(){S.apply(this,arguments),this._timer=null,this._input=null}function $(){W.apply(this,arguments)}function _(){W.apply(this,arguments)}function ab(){S.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function bb(a,b){return b=b||{},b.recognizers=m(b.recognizers,bb.defaults.preset),new cb(a,b)}function cb(a,b){b=b||{},this.options=i(b,bb.defaults),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=y(this),this.touchAction=new Q(this,this.options.touchAction),db(this,!0),g(b.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[2])},this)}function db(a,b){var c=a.element;g(a.options.cssProps,function(a,d){c.style[v(c.style,d)]=b?a:""})}function eb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var fb=["","webkit","moz","MS","ms","o"],gb=b.createElement("div"),hb="function",ib=Math.round,jb=Math.abs,kb=Date.now,lb=1,mb=/mobile|tablet|ip(ad|hone|od)|android/i,nb="ontouchstart"in a,ob=v(a,"PointerEvent")!==d,pb=nb&&mb.test(navigator.userAgent),qb="touch",rb="pen",sb="mouse",tb="kinect",ub=25,vb=1,wb=2,xb=4,yb=8,zb=1,Ab=2,Bb=4,Cb=8,Db=16,Eb=Ab|Bb,Fb=Cb|Db,Gb=Eb|Fb,Hb=["x","y"],Ib=["clientX","clientY"];x.prototype={handler:function(){},destroy:function(){this.evEl&&o(this.element,this.evEl,this.domHandler),this.evTarget&&o(this.target,this.evTarget,this.domHandler),this.evWin&&o(a,this.evWin,this.domHandler)}};var Jb={mousedown:vb,mousemove:wb,mouseup:xb},Kb="mousedown",Lb="mousemove mouseup";j(L,x,{handler:function(a){var b=Jb[a.type];b&vb&&0===a.button&&(this.pressed=!0),b&wb&&1!==a.which&&(b=xb),this.pressed&&this.allow&&(b&xb&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:sb,srcEvent:a}))}});var Mb={pointerdown:vb,pointermove:wb,pointerup:xb,pointercancel:yb,pointerout:yb},Nb={2:qb,3:rb,4:sb,5:tb},Ob="pointerdown",Pb="pointermove pointerup pointercancel";a.MSPointerEvent&&(Ob="MSPointerDown",Pb="MSPointerMove MSPointerUp MSPointerCancel"),j(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Mb[d],f=Nb[a.pointerType]||a.pointerType,g=f==qb;e&vb&&(0===a.button||g)?b.push(a):e&(xb|yb)&&(c=!0);var h=s(b,a.pointerId,"pointerId");0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Qb={touchstart:vb,touchmove:wb,touchend:xb,touchcancel:yb},Rb="touchstart touchmove touchend touchcancel";j(N,x,{handler:function(a){var b=Qb[a.type],c=O.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:qb,srcEvent:a})}}),j(P,x,{handler:function(a,b,c){var d=c.pointerType==qb,e=c.pointerType==sb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(xb|yb)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var Sb=v(gb.style,"touchAction"),Tb=Sb!==d,Ub="compute",Vb="auto",Wb="manipulation",Xb="none",Yb="pan-x",Zb="pan-y";Q.prototype={set:function(a){a==Ub&&(a=this.compute()),Tb&&(this.manager.element.style[Sb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){l(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),R(a.join(" "))},preventDefaults:function(a){if(!Tb){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=q(d,Xb),f=q(d,Zb),g=q(d,Yb);return e||f&&g||f&&c&Eb||g&&c&Fb?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var $b=1,_b=2,ac=4,bc=8,cc=bc,dc=16,ec=32;S.prototype={defaults:{},set:function(a){return h(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=V(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=V(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=V(a,this),-1===s(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=V(a,this);var b=s(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(c.options.event+(b?T(d):""),a)}var c=this,d=this.state;bc>d&&b(!0),b(),d>=bc&&b(!0)},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=ec)},canEmit:function(){for(var a=0;a<this.requireFail.length;a++)if(!(this.requireFail[a].state&(ec|$b)))return!1;return!0},recognize:function(a){var b=h({},a);return l(this.options.enable,[this,b])?(this.state&(cc|dc|ec)&&(this.state=$b),this.state=this.process(b),void(this.state&(_b|ac|bc|dc)&&this.tryEmit(b))):(this.reset(),void(this.state=ec))},process:function(){},getTouchAction:function(){},reset:function(){}},j(W,S,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(_b|ac),e=this.attrTest(a);return d&&(c&yb||!e)?b|dc:d||e?c&xb?b|bc:b&_b?b|ac:_b:ec}}),j(X,W,{defaults:{event:"pan",threshold:10,pointers:1,direction:Gb},getTouchAction:function(){var a=this.options.direction;if(a===Gb)return[Xb];var b=[];return a&Eb&&b.push(Zb),a&Fb&&b.push(Yb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Eb?(e=0===f?zb:0>f?Ab:Bb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?zb:0>g?Cb:Db,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return W.prototype.attrTest.call(this,a)&&(this.state&_b||!(this.state&_b)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=U(a.direction);b&&this.manager.emit(this.options.event+b,a),this._super.emit.call(this,a)}}),j(Y,W,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[Xb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&_b)},emit:function(a){if(this._super.emit.call(this,a),1!==a.scale){var b=a.scale<1?"in":"out";this.manager.emit(this.options.event+b,a)}}}),j(Z,S,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[Vb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(xb|yb)&&!f)this.reset();else if(a.eventType&vb)this.reset(),this._timer=e(function(){this.state=cc,this.tryEmit()},b.time,this);else if(a.eventType&xb)return cc;return ec},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===cc&&(a&&a.eventType&xb?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=kb(),this.manager.emit(this.options.event,this._input)))}}),j($,W,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[Xb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&_b)}}),j(_,W,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:Eb|Fb,pointers:1},getTouchAction:function(){return X.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Eb|Fb)?b=a.velocity:c&Eb?b=a.velocityX:c&Fb&&(b=a.velocityY),this._super.attrTest.call(this,a)&&c&a.direction&&jb(b)>this.options.velocity&&a.eventType&xb},emit:function(a){var b=U(a.direction);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),j(ab,S,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[Wb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&vb&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=xb)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=cc,this.tryEmit()},b.interval,this),_b):cc}return ec},failTimeout:function(){return this._timer=e(function(){this.state=ec},this.options.interval,this),ec},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==cc&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),bb.VERSION="2.0.2",bb.defaults={domEvents:!1,touchAction:Ub,inputTarget:null,enable:!0,preset:[[$,{enable:!1}],[Y,{enable:!1},["rotate"]],[_,{direction:Eb}],[X,{direction:Eb},["swipe"]],[ab],[ab,{event:"doubletap",taps:2},["tap"]],[Z]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var fc=1,gc=2;cb.prototype={set:function(a){return h(this.options,a),this},stop:function(a){this.session.stopped=a?gc:fc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&cc)&&(e=b.curRecognizer=null);for(var f=0,g=d.length;g>f;f++)c=d[f],b.stopped===gc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(_b|ac|bc)&&(e=b.curRecognizer=c)}},get:function(a){if(a instanceof S)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;var b=this.recognizers;return a=this.get(a),b.splice(s(b,a),1),this.touchAction.update(),this},on:function(a,b){var c=this.handlers;return g(r(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(r(a),function(a){b?c[a].splice(s(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&eb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0,e=c.length;e>d;d++)c[d](b)}},destroy:function(){this.element&&db(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(bb,{INPUT_START:vb,INPUT_MOVE:wb,INPUT_END:xb,INPUT_CANCEL:yb,STATE_POSSIBLE:$b,STATE_BEGAN:_b,STATE_CHANGED:ac,STATE_ENDED:bc,STATE_RECOGNIZED:cc,STATE_CANCELLED:dc,STATE_FAILED:ec,DIRECTION_NONE:zb,DIRECTION_LEFT:Ab,DIRECTION_RIGHT:Bb,DIRECTION_UP:Cb,DIRECTION_DOWN:Db,DIRECTION_HORIZONTAL:Eb,DIRECTION_VERTICAL:Fb,DIRECTION_ALL:Gb,Manager:cb,Input:x,TouchAction:Q,Recognizer:S,AttrRecognizer:W,Tap:ab,Pan:X,Swipe:_,Pinch:Y,Rotate:$,Press:Z,on:n,off:o,each:g,merge:i,extend:h,inherit:j,bindFn:k,prefixed:v}),typeof define==hb&&define.amd?define(function(){return bb}):"undefined"!=typeof module&&module.exports?module.exports=bb:a[c]=bb}(window,document,"Hammer");

/* DOM-based rendering (Uses 3D when available, falls back on margin when transform not available) */
var render = (function(global) {
    var docStyle = document.documentElement.style;

    var engine;
    if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
        engine = 'presto';
    } else if ('MozAppearance' in docStyle) {
        engine = 'gecko';
    } else if ('WebkitAppearance' in docStyle) {
        engine = 'webkit';
    } else if (typeof navigator.cpuClass === 'string') {
        engine = 'trident';
    }

    var vendorPrefix = {
        trident: 'ms',
        gecko: 'Moz',
        webkit: 'Webkit',
        presto: 'O'
    }[engine];

    var helperElem = document.createElement("div");
    var undef;

    var perspectiveProperty = vendorPrefix + "Perspective";
    var transformProperty = vendorPrefix + "Transform";
    var transformOrigin = vendorPrefix + "TransformOrigin";

    if (helperElem.style[perspectiveProperty] !== undef) {

        return {
            zoom: function(left, top, zoom, content) {
                content.style.marginLeft = left ? (-left) + 'px' : '';
                content.style.marginTop = top ? (-top) + 'px' : '';
            },
            rotate : function(rotateContent, degree){
                rotateContent.style[transformProperty] = 'rotate('+ degree +'deg)';
                rotateContent.style[transformOrigin] = '50% 50%';
            }
        };

    } else if (helperElem.style[transformProperty] !== undef) {

        return {
            zoom: function(left, top, zoom, content) {
                content.style.marginLeft = left ? (-left) + 'px' : '';
                content.style.marginTop = top ? (-top) + 'px' : '';
                document.getElementById('debug').innerHTML = '222222222';
            },
            rotate: function(rotateContent, degree, left, top){
                rotateContent.style[transformProperty] = 'rotate('+ degree +'deg)';
                rotateContent.style[transformOrigin] = '50% 50%';
            }
        };

    } else {

        return {
            zoom:function(left, top, zoom, content) {
                content.style.marginLeft = left ? (-left) + 'px' : '';
                content.style.marginTop = top ? (-top) + 'px' : '';
            },
            rotate: function(){

            }
        }

    }
})(this);

var eventHandler = function(scroller, content, sdk){

    var mc =  new Hammer.Manager(content);

    var pinch = new Hammer.Pinch(),
        rotate = new Hammer.Rotate(),
        pan = new Hammer.Pan(),
        tap = new Hammer.Tap();

    var doubleFinger = false;

    pinch.recognizeWith(rotate);
    mc.add([pinch, rotate, pan, tap]);
    /*
    var count = 0,firstTapTime;
    mc.on('tap', function(e){
        count += 1;
        if(count == 1){
            firstTapTime = e.timeStamp;
        }
        if(count == 2){
            if(e.timeStamp - firstTapTime < 1000)
                scroller.doMouseZoom(-1, e.timeStamp, e.pointers[0].pageX, e.pointers[0].pageY, 1.5);
            count = 0;
            sdk._setFontDivSize();
        }
    });*/

    mc.on('panstart', function(e){
        if(e.preventDefault){
            e.preventDefault();
        }
        scroller.doTouchStart(e.pointers, e.timeStamp);
    });
    mc.on('panmove', function(e){
        if(e.preventDefault){
            e.preventDefault();
        }
        scroller.doTouchMove(e.pointers, e.timeStamp);
        //document.getElementById('debug').innerHTML = 'moving:' + e.pointers[0].pageX + ","+ e.pointers[0].pageY;
    });
    mc.on('panend', function(e){
        if(e.preventDefault){
            e.preventDefault();
        }
        scroller.doTouchEnd(e.timeStamp);
    });

    mc.on('pinchstart rotatestart', function(e){
        if(e.preventDefault){
            e.preventDefault();
        }
        sdk._hiddenPoiDiv();
        doubleFinger = true;
        if(e.type == 'pinchstart'){
            scroller.doTouchStart(e.pointers, e.timeStamp);
        }
        if(e.type == 'rotatestart'){
            scroller.doRotateStart(e.center, e.rotation, e.timeStamp);
            //document.getElementById('debug').innerHTML = e.center.x +':' + e.center.y;
        }
    });

    mc.on('pinchmove rotatemove', function(e){
        if(e.preventDefault){
            e.preventDefault();
        }
        if(e.type == 'pinchmove'){
            scroller.doTouchMove(e.pointers, e.timeStamp, e.scale);
        }
        if(e.type == 'rotatemove'){
            scroller.doTouchRotate( e);
        }
    });
    content.addEventListener('touchend', function(e){
        if(e.preventDefault){
            e.preventDefault();
        }
        if(doubleFinger){
            scroller.doTouchEnd(e.timeStamp);
            sdk._setFontDivSize();
            doubleFinger = false;
        }
    }, false);

    content.addEventListener("touchcancel", function(e) {
        scroller.doTouchEnd(e.timeStamp);
        //sdk._checkIsToCenter();
        sdk._setFontDivSize();
    }, false);

    if(!('ontouchstart' in window)){
        content.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
            if(e.preventDefault){
                e.preventDefault();
            }
            var wheelDelta = e.detail ? (e.detail * 120) : -e.wheelDelta;
            scroller.doMouseZoom(wheelDelta, e.timeStamp, e.pageX, e.pageY, null);
            //scroller.doMouseRotate(wheelDelta, e.timeStamp, e.offsetX, e.offsetY);
            sdk._setFontDivSize();
        }, false);
    }
};


var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
    r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
        32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
        2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
    q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
        a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
    e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
    l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
    _doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
        f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
            m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
            E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
        4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
    l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
    finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
    c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
    e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
    this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
    1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
    decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
    b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
    16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
    8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
    d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

var ATLASENCRPY = {
    decrypt: function(key, data){
        var bytes = CryptoJS.AES.decrypt(data, key);
        return bytes.toString(CryptoJS.enc.Utf8)
    },
    encrypt: function(key, data){
        return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    }
};

var Atlas, AtlasCallback;

(function() {
    Atlas = function (options) {
        var self = this;
        self.options = options;
        self.width = options['width'];
        self.height = options['height'];
        self.floorList = options['floorList'];
        self.cityId = options['cityId'];
        self.mapDivId = options['mapDiv'];
        self.initFloor = options['initFloor'] || 'Floor1';
        self.initMarkPoi = options['initMarkPoi'] || null;
        self.logoInit = options['logoInit'] === undefined ? true : options['logoInit'];
        self.enFloorUI = options['enFloorUI'] === undefined ? true : options['enFloorUI'];
        self.enFacUI = options['enFacUI'] === undefined ? true : options['enFacUI'];
        self.enBufferUI = options['enBufferUI'] === undefined ? true : options['enBufferUI'];
        self._maxZoom = options['maxZoom'] || 20;
        self._minZoom = options['minZoom'] || 1;
        self._initZoomLv = options['initZoom'] || 3;
        self._initCallback = options['initCallback'];
        self._poiClick = options['poiClick'] || function(){};

        self.__svgPaddingTop = 0;
        self.__svgPaddingLeft = 0;
        self.__markPositionRangeX = -0.5;
        self.__markPositionRangeY = -1;
        self.__drawScale = 1;

        self.svg = {};
        self.svg.floors = {};
        self.floorObj = {};

        self.__mapZIndex = {
            poi: 2,
            nav: 1,
            tag: 3,
            img: 4
        };

        self._initDom();
        self._initData();
        self._bufferUIStart();

        self.__zoomCoefficient = Math.max(+self.width, +self.height) / 5000;

        var isResetMarker = false;
        self.scroller = self._initScroller({
            minZoom: self._minZoom,
            maxZoom: self._maxZoom,
            onCompleteFunc: function () {
                isResetMarker = true;
            }
        });
        self.scroller.__onZoomingFunc = function () {
            if (isResetMarker) {
                //self._checkIsToCenter();
                isResetMarker = false;
            }
            if(!(self.scroller.__isDragging && self.scroller.__isSingleTouch)){
                self._updateSvgStyle();
            }
        };

        self._initialize = function () {
            self._entityModel();
            self.autoZoom();
            self._getFloorUI();
            self._draw(self.curFloor);
            self.resetMark();
            self._bufferUIStop();
            self._setFontDivSize();
            var timerId = setTimeout(function () {
                    if (self.initMarkPoi) {
                        //self.moveToPoiId(self.initMarkPoi, true)
                    }
                    self._initCallback();
                    clearTimeout(timerId);
                },
                500)
        }
    };
    var p = Atlas.prototype;

    p._getTransformByEngine = function() {
        var docStyle = document.documentElement.style;
        var engine;
        if (window.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
            engine = 'presto'
        } else if ('MozAppearance' in docStyle) {
            engine = 'gecko'
        } else if ('WebkitAppearance' in docStyle) {
            engine = 'webkit'
        } else if (typeof navigator.cpuClass === 'string') {
            engine = 'trident'
        }
        var vendorPrefix = {
            trident: 'ms',
            gecko: 'Moz',
            webkit: 'Webkit',
            presto: 'O'
        } [engine];

        return vendorPrefix;
    };
    p._floorUICreateInRoot = function() {
        var self = this;
        if (self.enFloorUI) {
            try {
                self._createFloorUI()
            } catch(e) {
                console.log('Error: enFloorUI require file "atlasSdk.ui.js"!')
            }
        }
    };
    p._getFloorUI = function() {
        var self = this;
        if (self.enFloorUI) {
            try {
                self._setFloorUI()
            } catch(e) {
                console.log(e)
                console.log('Error: enFloorUI require file "atlasSdk.ui.js"!')
            }
        }
    };
    p._bufferUIStart = function() {
        var self = this,
            enBufferUI = self.enBufferUI;
        if (enBufferUI) {
            try {
                self._buffering()
            } catch(e) {
                console.log('Error: enBufferUI require file "atlasSdk.ui.js"!')
            }
        }
    };
    p._bufferUIStop = function() {
        var self = this;
        if (self.enBufferUI) {
            try {
                self._stopBuffering()
            } catch(e) {
                console.log('Error: enBufferUI require file "atlasSdk.ui.js"!')
            }
        }
    };
    p._getFacUI = function() {
        var self = this;
        if (self.enFacUI) {
            try {
                self._setFacUI()
            } catch(e) {
                console.log('Error: enFacUI require file "atlasSdk.ui.js"!')
            }
        }
    };

    p._initDom = function() {
        var self = this,
            rootDiv = document.getElementById(self.mapDivId),
            zoomDiv = document.createElement('div'),
            mapDiv = document.createElement('div'),
            innerDiv = document.createElement('div'),
            textDiv = document.createElement('div'),
            compassDiv = document.createElement('div'),
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        zoomDiv.setAttribute('class', 'atlas-container');
        mapDiv.setAttribute('class', 'atlas-content');
        textDiv.setAttribute('class', 'atlas-text');
        svg.appendChild(g);
        innerDiv.appendChild(svg);
        innerDiv.appendChild(textDiv);
        mapDiv.appendChild(innerDiv);
        zoomDiv.appendChild(mapDiv);
        zoomDiv.appendChild(compassDiv);
        rootDiv.appendChild(zoomDiv);

        self.atlasDiv = rootDiv;
        self.zoomDiv = zoomDiv;
        self.mapDiv = mapDiv;
        self.rotateDiv = innerDiv;
        self.textDiv = textDiv;
        self.svgDom = svg;
        self.gDom = g;
        self.compassDiv = compassDiv;
        self._floorUICreateInRoot();
        self._getFacUI();
        self._logoInit();

        var zoomHeight;
        if(self.floorDiv){
            zoomHeight = self.height - self.floorDiv.clientHeight;
            self.__uiHeight = self.floorDiv.clientHeight;
        }else{
            zoomHeight = self.height;
            self.__uiHeight = 0;
        }
        rootDiv.setAttribute('style','width:' + self.width + 'px; height: '+ self.height +'px;');
        zoomDiv.setAttribute("style", "width:" + self.width + "px;height:" + zoomHeight + "px;");
        compassDiv.setAttribute('style', 'cursor:pointer;position: absolute; width: 32px; height:32px; top:8px;left: 10px;border-radius: 32px;over-flow:hidden;opacity:0.8;' );
        compassDiv.style['background'] = 'url("http://atlassdk.qiniudn.com/img/compass1.png") no-repeat  -4px -4px / 40px 40px';
        self._zoomBoundary = {
            minX: 0,
            minY: 0,
            maxX: self.zoomDiv.offsetWidth || self.width,
            maxY: self.zoomDiv.offsetHeight || zoomHeight
        };
    };

    p._logoInit = function(){
        var self = this;
        if(self.logoInit){
            var logoDiv = document.createElement('div');
            self.zoomDiv.appendChild(logoDiv);
            var defaultUrl = 'data:image/jpeg;base64,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';
            var logoUrl = self.logoInit.url || defaultUrl;
            var size = self.logoInit.size || 50;
            var w = size, h = size * 0.45;
            var opacity = self.logoInit.opacity || 0.5;
            logoDiv.setAttribute('style', 'position: absolute; width: '+ w +'px; height:'+ h +'px; bottom:5px;left: 5px;opacity:'+ opacity +';' );
            logoDiv.style['background'] = 'url("'+ logoUrl +'") no-repeat 0 0 / '+ w +'px ' + h + 'px';
        }else{
            return;
        }
    };

    p._initData = function() {
        var self = this,
            floorList = self.floorList;
        var extraInitFloor;
        floorList.forEach(function(item) {
            var key = Object.keys(item)[0];
            self.floorObj[key] = item[key];
            if(!extraInitFloor){
                extraInitFloor = item[key];
            }
        });
        if(self.floorObj[self.initFloor]){
            self._getFloorData(self.floorObj[self.initFloor], function(res){
                if(res){
                    self._initialize();
                }else{
                    console.log('There is no map data!');
                }
            });
        }else{
            self._getFloorData(extraInitFloor, function(res){
                if(res){
                    self._initialize();
                }else{
                    console.log('There is no map data!');
                }
            });
        }
    };

    p._getFloorData = function(floorId, callback) {
        var self = this,
            script = document.createElement('script'),
            apiUrl;
        if(self.options['apiUrl']){
            apiUrl = self.options['apiUrl'] + '?callback=AtlasCallback&id=';
        }else{
            apiUrl = 'http://iscan.atlasyun.com/poi/map/floor/getSimple?callback=AtlasCallback&id=';
        }
        var url = apiUrl + floorId;
        script.setAttribute('src', url);
        var compareCoordinate = function( list ){
            var mySort = function(a, b){
                if(a[3] !== b[3]){
                    return (a[3] - b[3]);
                }else{
                    return b[0] - a[0]
                }
            };
            list = list.sort(mySort);
            for(var i=0; i < list.length-1; ++i){
                for(var j=1+i; j<list.length; ++j){
                    if(+list[i][3] != +list[j][3]){
                        break;
                    }else{
                        var distance = Math.sqrt((list[i][0] -list[j][0]) * (list[i][0] -list[j][0]) + (list[i][1] -list[j][1]) * (list[i][1] -list[j][1]));
                        if(distance < 10 && list[i][4] == list[j][4]){
                            list[i][5] = true;
                        }
                    }
                }
            }
            return list;
        };
        document.body.appendChild(script);
        AtlasCallback = function (data) {
            if (data.result == 'succeed') {
                var floorData = JSON.parse(ATLASENCRPY.decrypt('ap.atlasyun.com', data.data));
                //var floorData = localMapData.data;
                //floorData[9] = compareCoordinate(floorData[9]);
                self._floorData = floorData;
                try{
                    document.body.removeChild(script);
                }catch(e){}

                callback(true);
            } else {
                self._floorData = null;
                callback(null)
            }
        }
    };
    /*聚合sdk获取数据的method*/
    p._getFloorData2 = function(floorId, callback) {
        var self = this;
        if(window.ATLAS_AUTHENTIC_KEY){
            if(window.ATLAS_AUTHENTIC_KEY == 'atlas'){
                var apiUrl = 'http://ap.atlasyun.com:3001/map/floor/getSimple?callback=AtlasCallback&id=';
            }else{
                var apiUrl = 'http://op.juhe.cn/atlasyun/map/index?key=' + window.ATLAS_AUTHENTIC_KEY + '&cityid=' + self.cityId + '&floorid=';
            }
        }else{
            throw new Error('Invalid authKey! Call api need a key!');
        }

        var url = apiUrl + floorId,
            script = document.createElement('script');
        script.setAttribute('src', url);
        document.body.appendChild(script);
        AtlasCallback = function (data) {
            var key;
            if (data) {
                if(window.ATLAS_AUTHENTIC_KEY == 'atlas') {
                    data = data.data;
                    key = 'ap.atlasyun.com';
                }else{
                    key = 'eDnchx=.34yAopQ='
                }
                self._floorData = JSON.parse(ATLASENCRPY.decrypt(key, data));
                document.body.removeChild(script);
                callback(true);
            } else {
                self._floorData = null;
                callback(null)
            }
        }
    };

    p._initScroller = function(options) {
        var scroller = new Scroller(render, {
            animating: true,
            animationDuration: 200,
            bouncing: true,
            locking: true,
            paging: false,
            zooming: true,
            scrollingX: true,
            scrollingY: true,
            minZoom: options.minZoom || 1,
            maxZoom: options.maxZoom || 20,
            speedMultiplier: 1,
            scrollingComplete: options.onCompleteFunc || NOOP,
            penetrationDeceleration: 0.03,
            penetrationAcceleration: 0.08,
            zoomContent: this.zoomDiv,
            mapContent: this.mapDiv,
            rotateContent: this.rotateDiv
        });
        var container = this.textDiv;
        eventHandler(scroller, container, this);
        return scroller
    };

    p._entityModel = function() {
        var self = this,
            mapData = self._floorData;

        self._tagPath = "http://atlasSdk.qiniudn.com/img/pin.png";
        self.__vendorPrefix = self._getTransformByEngine();
        self._markAction = function(target) {
            var poi;
            if (target.className.indexOf('atlas-shop') > -1) {
                poi = {
                    id: target.getAttribute('poiId'),
                    name: target.innerText || target.textContent
                };
                self._poiClick(poi)
            }
            if (target.className.indexOf('atlas-fac') > -1){
                poi = {
                    id: target.getAttribute('facId'),
                    name: target.getAttribute('title')
                };
                self._poiClick(poi)
            }
        };

        self.compassDiv.addEventListener('ontouchstart' in window ? 'touchend': 'mouseup', function(e){
            self._rotateTo(0);
        });

        var mapData = {
            name: mapData[1] || '',
            width: mapData[4] || 0,
            height: mapData[5] || 0,
            floor: mapData[6] || [],
            shopShapes: mapData[7] || [],
            shops: mapData[8] || [],
            fac: mapData[9] || [],
            text: mapData[10] || [],
            img: []
        };
        self.curFloor = mapData.name;
        self.svg.floors[self.curFloor] = mapData;
        self.icons = ['atlas-mom-baby', 'atlas-lift', 'atlas-stairs', 'atlas-escalator', 'atlas-gate', 'atlas-question-down', 'atlas-cashier-desk', 'atlas-parking', 'atlas-toilet', 'atlas-toilet-man', 'atlas-toilet-woman', 'atlas-vip-service', 'atlas-handicapped', 'atlas-taxi', 'atlas-ticket-service', 'atlas-metro', 'atlas-atm'];
        self.prods = ['atlas-eat', 'atlas-drink', 'atlas-play', 'atlas-household', 'atlas-life-service', 'atlas-food', 'atlas-child-product', 'atlas-clothing-ornament', 'atlas-menswear', 'atlas-womenswear', 'atlas-sport-leisure', 'atlas-bag-accessory', 'atlas-cosmetic', 'atlas-electrical-equipment', 'atlas-digital-product', 'atlas-furniture', 'atlas-stationery', 'atlas-jewellery', 'atlas-clock-glass', 'atlas-meeting', 'atlas-sale', 'atlas-other'];
        self._filterData = {};
        self._filtered = {};
        self._filterDistance = {};
        self._filterScale = {};
        self._mapDataForEmphasizeMark = null;

        self._initDomStyle();
    };
    p._getMapPoint = function() {
        var self = this,
            floor = self.svg.floors[self.curFloor].floor,
            floorShape = typeof(floor) !== 'string'? floor[0] : floor,
            pathArray = floorShape.split(/[A-Za-z]/g),
            proxyX = [],
            proxyY = [],
            res = {
                min: {},
                center: {},
                max: {},
                all: []
            },
            arr,
            tempX,
            tempY;
        if(floor[1] !== undefined && floor[1] == 'rect'){
            var attrs = floorShape.split(/\s+/g);
            var attrsObj = {};
            attrs.forEach(function(attr){
                eval('attrsObj.'+ attr.trim());
            })
            res.min.x = Math.floor(+attrsObj.x);
            res.min.y =  Math.floor(+attrsObj.y);
            res.max.x = Math.floor(+attrsObj.x + +attrsObj.width);
            res.max.y = Math.floor(+attrsObj.y + +attrsObj.height);
            res.center.x = (res.min.x + res.max.x) / 2;
            res.center.y = (res.min.y + res.max.y) / 2;
            res.all = [[res.min.x, res.min.y], [res.max.x, res.min.y], [res.max.x, res.max.y],[res.min.x, res.max.y]]
            return  res;
        }
        pathArray.forEach(function(item) {
            arr = item.replace(/^\s+|\s+$/g, '').split(/\s+|,+/g);
            if (arr.length == 2) {
                tempX = parseFloat(arr[0]);
                tempY = parseFloat(arr[1]);
                proxyX.push(tempX);
                proxyY.push(tempY);
                res.all.push([tempX, tempY])
            }
            if (arr.length == 7) {
                tempX = parseFloat(arr[5]);
                tempY = parseFloat(arr[6]);
                proxyX.push(tempX);
                proxyY.push(tempY);
                res.all.push([tempX, tempY])
            }
        });
        var mySort = function(a, b) {
            return (a - b)
        };
        proxyX.sort(mySort);
        proxyY.sort(mySort);
        res.min.x = proxyX[0];
        res.min.y = proxyY[0];
        res.max.x = proxyX[proxyX.length - 1];
        res.max.y = proxyY[proxyY.length - 1];
        res.center.x = (res.min.x + res.max.x) / 2;
        res.center.y = (res.min.y + res.max.y) / 2;
        return res
    };

    p._initDomStyle = function(){
        var self = this;

        var mapData = self.svg.floors[self.curFloor],
            svgViewBoxWidth = mapData.width,
            svgViewBoxHeight = mapData.height;

        var points = self._getMapPoint();
        self._mapCenter = points.center;
        self._mapVertexes = points.all;

        //if (+points.max.x > +svgViewBoxWidth)
            svgViewBoxWidth = Math.ceil(points.max.x + points.min.x + 5);
        //if (+points.max.y > +svgViewBoxHeight)
            svgViewBoxHeight = Math.ceil(points.max.y + points.min.y + 5);
        svgViewBoxWidth = +svgViewBoxWidth;
        svgViewBoxHeight = +svgViewBoxHeight;
        self.svgDom.setAttribute('viewBox',"0 0 " + svgViewBoxWidth + " " + svgViewBoxHeight);

        var zoomWidth = self.zoomDiv.offsetWidth,
            zoomHeight = self.zoomDiv.offsetHeight;

        var svgScaleToFill = Math.round(Math.min(zoomWidth / svgViewBoxWidth, zoomHeight / svgViewBoxHeight) * 100)/100;
        var svgOriginalWidth = Math.round(svgViewBoxWidth * svgScaleToFill - 0.5);
        var svgOriginalHeight = Math.round(svgViewBoxHeight * svgScaleToFill - 0.5);

        self.__mapOriginalWidth = zoomWidth * 3;
        self.__mapOriginalHeight = zoomWidth * 3;

        var left = Math.round((self.__mapOriginalWidth - svgOriginalWidth) / 2),
            top = Math.round((self.__mapOriginalHeight - svgOriginalHeight) / 2);

        self.svgDom.style['width'] = '' + svgOriginalWidth + 'px';
        self.svgDom.style['height'] = '' + svgOriginalHeight + 'px';
        self.svgDom.style['position'] = 'absolute';
        self.svgDom.style['left'] = '' + left + 'px';
        self.svgDom.style['top'] = '' + top + 'px';
        self.svgDom.style['visibility'] = 'visible';
        self.svgDom.style['overflow'] = 'visible';

        self.rotateDiv.style['width'] =  '100%';
        self.rotateDiv.style['height'] =  '100%';

        self.__svgScale = svgScaleToFill;
        self.__drawScale = svgScaleToFill;

        self.mapDiv.style['width'] = '' + self.__mapOriginalWidth + 'px';
        self.mapDiv.style['height'] = '' + self.__mapOriginalHeight + 'px';

        self.textDiv.style['width'] = '100%';
        self.textDiv.style['height'] = '100%';
        self.textDiv.style['position'] = 'absolute';
        self.textDiv.style['top'] = '0px';
        self.textDiv.style['left'] = '0px';

        self.__svgOriginalWidth = svgOriginalWidth;
        self.__svgOriginalHeight = svgOriginalHeight;
        self.__svgOriginalLeft = left;
        self.__svgOriginalTop = top;
    };

    p._updateSvgStyle = function(){
        var self = this;
        self.svgDom.style['width'] = '' + (self.__svgOriginalWidth * self.scroller.__zoomLevel) + 'px';
        self.svgDom.style['height'] = '' + (self.__svgOriginalHeight * self.scroller.__zoomLevel) + 'px';
        self.svgDom.style['left'] = '' + (self.__svgOriginalLeft * self.scroller.__zoomLevel) + 'px';
        self.svgDom.style['top'] = '' + (self.__svgOriginalTop * self.scroller.__zoomLevel) + 'px';
        self.compassDiv.style[self.__vendorPrefix + 'TransformOrigin'] = '50% 50%';
        self.compassDiv.style[self.__vendorPrefix + 'Transform'] = 'rotate(' + (self.scroller.__rotateDegree - 26) +'deg)';
        self._updateNavigation();
    };

    p.autoZoom = function() {
        var self = this;
        self.refresh();
        self.zoomTo(this._initZoomLv);
        self.moveToCenter(false)
    };
    p.zoomTo = function(zoomlv) {
        var self = this,
            pageX = self.zoomDiv.offsetWidth / 2,
            pageY = self.zoomDiv.offsetHeight / 2;

        self.scroller.zoomTo(zoomlv, false, pageX, pageY, self.scroller.options.scrollingComplete)
    };
    p._rotateTo = function(degree, x, y){
        var self = this;
        self.scroller.__rotateDegree = degree;
        self._setFontDivSize();
        self.rotateDiv.style[self.__vendorPrefix + 'Transform'] = 'rotate(' + degree +'deg)';
        self.compassDiv.style[self.__vendorPrefix + 'Transform'] = 'rotate(' + (degree - 26) +'deg)';
        if(x == undefined || y == undefined){
            self.moveToCenter();
        }else{
            self._moveTo(x, y);
        }
    };
    p.refresh = function() {
        var self = this;
        self.scroller.setPosition(self.zoomDiv.offsetLeft + self.zoomDiv.clientLeft, self.zoomDiv.offsetTop + self.zoomDiv.clientTop);
        self.scroller.setDimensions(self.zoomDiv.clientWidth, this.zoomDiv.clientHeight, (self.__mapOriginalWidth || self.mapDiv.offsetWidth), (self.__mapOriginalHeight || self.mapDiv.offsetHeight));
    };

    p._createPathFragment = function(svgData, sidPaths, drawScale){
        sidPaths = sidPaths || {};
        drawScale = drawScale || 1;
        var scale = Math.floor(1 / +drawScale * 100)/ 100;
        var fragment = document.createDocumentFragment();

        var createPathDom = function (className, d, style, strokeWidth) {
            strokeWidth = strokeWidth || 0.3;
            style = style || '';
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', className);
            path.setAttribute('d', d);
            path.style.cssText = style + 'stroke-width:' + strokeWidth * scale + 'px';
            var sidRegResult = style.match(/(sid[^;]+);?/);
            if(sidRegResult){
                var sidStr = sidRegResult[1].split(':')[1].trim();
                if(sidPaths[sidStr] == undefined){
                    sidPaths[sidStr] = {};
                }else{
                    if(sidPaths[sidStr].borderColor){
                        path.style['stroke'] = sidPaths[sidStr].borderColor;
                        path.style['stroke-width'] = 0.5 * scale;
                    }
                    if(sidPaths[sidStr].fillColor){
                        path.style['fill'] = sidPaths[sidStr].fillColor;
                    }
                }
            }
            return path
        };
        var createRectDom = function(className, shape, style, strokeWidth){
            strokeWidth = strokeWidth || 0.3;
            style = style || '';
            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('class', className);
            var attrs = shape.split(/\s+/g);
            var attrsObj = {};
            attrs.forEach(function(attr){
                eval('attrsObj.'+ attr.trim());
            });
            rect.setAttribute('x', Math.floor(attrsObj.x));
            rect.setAttribute('y', Math.floor(attrsObj.y));
            rect.setAttribute('width', Math.floor(attrsObj.width));
            rect.setAttribute('height', Math.floor(attrsObj.height));
            if(/(rotate\(.+\))/g.test(style)){
                rect.setAttribute('transform', RegExp.$1.replace(/;+/g, ' '));
            }
            rect.style.cssText = style + 'stroke-width:' + strokeWidth * scale + 'px';
            var sidRegResult = style.match(/(sid[^;]+);?/);
            if(sidRegResult){
                var sidStr = sidRegResult[1].split(':')[1].trim();
                if(sidPaths[sidStr] == undefined){
                    sidPaths[sidStr] = {};
                }else{
                    if(sidPaths[sidStr].borderColor){
                        rect.style['stroke'] = sidPaths[sidStr].borderColor;
                        rect.style['stroke-width'] = 0.5 * scale;
                    }
                    if(sidPaths[sidStr].fillColor){
                        rect.style['fill'] = sidPaths[sidStr].fillColor;
                    }
                }
            }
            return rect;
        }
        var shopShape, type;

        for (var j in svgData.shopShapes) {
            shopShape = svgData.shopShapes[j];
            if (shopShape[0] == 0) {
                type = 'atlas-shop-svg atlas-not-accessible';
                if (shopShape[2] == 'path') {
                    fragment.appendChild(createPathDom(type, shopShape[1], shopShape[3]));
                }else if(shopShape[2] == 'rect'){
                    fragment.appendChild(createRectDom(type, shopShape[1], shopShape[3]));
                }
            }

        }
        for (var j in svgData.shopShapes) {
            shopShape = svgData.shopShapes[j];
            if (shopShape[0] == 1) {
                type = 'atlas-shop-svg';
                if (shopShape[2] == 'path') {
                    fragment.appendChild(createPathDom(type, shopShape[1], shopShape[3]))
                }else if(shopShape[2] == 'rect'){
                    fragment.appendChild(createRectDom(type, shopShape[1], shopShape[3]))
                }
            }
        }
        if (svgData.floor) {
            if(svgData.floor[1] == 'path'){
                fragment.appendChild(createPathDom('atlas-floor-svg', svgData.floor[0], svgData.floor[3], 0.5));
            }else if(svgData.floor[1] == 'rect'){
                fragment.appendChild(createRectDom('atlas-floor-svg', svgData.floor[0], svgData.floor[3], 0.5));
            }

        }
        return fragment;
    };
    p._createBaseImg = function(){
        var self = this;
        var prefix = '/poi';
        var imgUrl = 'map/{floorId}/img';
        if(self.options['apiUrl'] && self.options['apiUrl'].indexOf('/poi/') <= -1){
            var host = self.options['apiUrl'].match(/http:\/\/([^\/]+)\//i);
            prefix = !!host ?  host[0] : '/'
        }else if(self.options['serverHost']){
            prefix = 'http://' + self.options['serverHost'] + '/poi/'
        }else{
            prefix =  '/poi/'
        }
        var floorId = self.floorObj[self.curFloor];
        var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        img.href.baseVal = prefix + imgUrl.replace('{floorId}', floorId) + '?r=' + new Date().getTime();
        img.setAttribute('x', 0);
        img.setAttribute('y', 0);
        img.setAttribute("preserveAspectRatio", 'none meet');
        img.setAttribute("width","100%");
        img.setAttribute("height","100%");
        return img
    };
    p._draw = function(floorName) {
        var self = this,
            svg = self.svg;
        self._clearGdom();
        self.__sidPaths = {};
        var fragment = self._createPathFragment(svg.floors[floorName], self.__sidPaths, self.__drawScale);
        self.gDom.appendChild(fragment);
        var img = self._createBaseImg();
        self.gDom.appendChild(img);
    };
    p._clearGdom = function(){
        var self = this;
        self.gDom.innerHTML = '';
        if (self.gDom.hasChildNodes()) {
            self.svgDom.removeChild(self.gDom);
            self.gDom = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            self.svgDom.appendChild(self.gDom)
        }
        return self.gDom;
    };
})();
(function(global){
    var p = global.prototype;

    p.moveToCenter = function(isAnimate) {
        var isAnimate = isAnimate && true;
        var self = this,
            centerLeft = self.scroller.__maxScrollLeft / 2,
            centerTop = self.scroller.__maxScrollTop / 2;
        self.scroller.scrollTo(centerLeft, centerTop, isAnimate, null);
    };
    p.moveTo = function(x, y, isZoom) {
        var self = this,
            isZoom = isZoom || false;
        if (isZoom) {
            self.zoomTo(self._initZoomLv)
        }
        self._moveTo(x, y)
    };
    p._moveTo = function(x, y) {
        var self = this,
            offsetTop = self.zoomDiv.offsetTop,
            offsetLeft = self.zoomDiv.offsetLeft,
            scrollLeft = self.scroller.__scrollLeft,
            scrollTop = self.scroller.__scrollTop,
            centerLeft = (self._zoomBoundary.maxX - self._zoomBoundary.minX) / 2 + offsetLeft,
            centerTop = (self._zoomBoundary.maxY - self._zoomBoundary.minY) / 2 + offsetTop,
            position = self.getLeftAndTop(x, y),
            diffLeft = centerLeft - position.left,
            diffTop = centerTop - position.top;
        self.scroller.scrollTo(scrollLeft - diffLeft, scrollTop - diffTop, true, null);
    };

    p.moveToPoiId = function(poiId, isZoom) {
        var self = this,
            data = JSON.stringify(self.svg.floors[self.curFloor]),
            tempData = JSON.parse(data),
            shops = tempData.shops,
            curDom;
        shops.forEach(function(shop) {
            if (shop[3] === poiId) {
                shop[2] = 100;
                curDom = {
                    x: shop[0],
                    y: shop[1]
                }
            }
        });
        tempData.shops = shops;
        self._clearFilterCache(self.curFloor);
        self._mapDataForEmphasizeMark = tempData;
        if (curDom) {
            if (isZoom && isZoom === true) {
                self.zoomTo(self._initZoomLv)
            }
            self.moveTo(curDom.x, curDom.y);
            self.tagTo(curDom.x, curDom.y)
        } else {
            console.log('Not found poi with id( "' + poiId + '" )!')
        }
    };

    p.getLeftAndTop = function(x, y ) {
        var self = this,
            svgScale = self.__svgScale,
            svgOriginalLeft = self.__svgOriginalLeft,
            svgOriginalTop = self.__svgOriginalTop,
            scale = self.scroller.getValues().zoom,
            scrollLeft = self.scroller.__scrollLeft,
            scrollTop = self.scroller.__scrollTop,
            offsetTop = self.zoomDiv.offsetTop,
            offsetLeft = self.zoomDiv.offsetLeft,
            centerX = self._mapCenter.x,
            centerY = self._mapCenter.y,
            res = {};

        if(+x == +centerX && +y == + centerY){
            res.left = (+x * svgScale + svgOriginalLeft) * scale - scrollLeft - offsetLeft;
            res.top = (+y * svgScale + svgOriginalTop) * scale - scrollTop - offsetTop;
            return res
        }else{
            var mapCenter = {
                x: Math.round(self.rotateDiv.clientWidth / 2),
                y: Math.round(self.rotateDiv.clientHeight / 2)
            };
            var offsetPoint = {
                x: Math.round((+x * svgScale + svgOriginalLeft) * scale),
                y: Math.round((+y * svgScale + svgOriginalTop) * scale)
            };
            var rotatedPosition = self.getRotatedPoint(mapCenter, offsetPoint, self.scroller.__rotateDegree);
            res.left = rotatedPosition.x - scrollLeft + offsetLeft;
            res.top = rotatedPosition.y - scrollTop + offsetTop;
            return res
        }
    };

    p.getRotatedPoint = function(center, point, deltaDeg){
        var r = Math.sqrt((center.x - point.x) * (center.x - point.x) +  (center.y - point.y) * (center.y - point.y));
        var deg, k, res, radian;
        if(r != 0){
            if(center.x == point.x){
                if(center.y < point.y){
                    deg = 90 + deltaDeg;
                }else{
                    deg = 270 + deltaDeg;
                }
            }else{
                k = (center.y - point.y) / (center.x - point.x);
                if((center.x > point.x && center.y > point.y) || (center.x > point.x && center.y < point.y)){
                    deg = Math.atan(k) * 180  / Math.PI + 180 + deltaDeg;
                }
                if((center.x < point.x && center.y < point.y) || (center.x < point.x && center.y > point.y)){
                    deg = Math.atan(k) * 180  / Math.PI + deltaDeg;
                }
            }
            radian = deg * Math.PI / 180;
            res = {
                x: Math.round(r * Math.cos(radian) + center.x),
                y: Math.round(r * Math.sin(radian) + center.y)
            };
            return res;
        }else{
            return center;
        }
    };

    p.getCoordinateByPosition = function(left, top) {
        var self = this,
            drawScale = self.__drawScale,
            svgPaddingTop = self.__svgPaddingTop,
            svgPaddingLeft = self.__svgPaddingLeft,
            scale = self.scroller.getValues().zoom,
            scrollLeft = self.scroller.__scrollLeft,
            scrollTop = self.scroller.__scrollTop,
            res = {};
        res.x = ((+left + scrollLeft) / scale - svgPaddingLeft) / drawScale;
        res.y = ((+top + scrollTop) / scale - svgPaddingTop) / drawScale;
        return res
    };

    p._checkIsToCenter = function() {
        console.log('checking')
        var self = this,
            mapVertexIsInBoundary = false,
            mapCrossOverBoundary = false,
            zoomBoundary = self._zoomBoundary,
            mapVertex = self._mapVertexes;
        var pointInPolygon = function(point, vertex) {
            var i,
                polySides = vertex.length,
                j = polySides - 1,
                x = point.x,
                y = point.y,
                oddNodes = false,
                slope;
            for (i = 0; i < polySides; ++i) {
                if (((vertex[i][1] < y && vertex[j][1] >= y) || (vertex[j][1] < y && vertex[i][1] >= y)) && (vertex[i][0] <= x || vertex[j][0] <= x)) {
                    slope = (vertex[j][0] - vertex[i][0]) / (vertex[j][1] - vertex[i][1]);
                    if (vertex[i][0] + (y - vertex[i][1]) * slope < x) {
                        oddNodes = !oddNodes
                    }
                }
                j = i
            }
            return oddNodes
        };
        var minClientPoint = self.getCoordinateByPosition(0, 0),
            maxClientPoint = self.getCoordinateByPosition(zoomBoundary.maxX, zoomBoundary.maxY),
            boundary = {
                minX: 0,
                minY: 0,
                maxX: zoomBoundary.maxX,
                maxY: zoomBoundary.maxY
            },
            lines = [{
                val: boundary.minX,
                type: 'Y'
            },
                {
                    val: boundary.maxX,
                    type: 'Y'
                },
                {
                    val: boundary.minY,
                    type: 'X'
                },
                {
                    val: boundary.maxY,
                    type: 'X'
                }],
            clientVertex;
        clientVertex = [[boundary.minX, boundary.minY], [boundary.minX, boundary.maxY], [boundary.maxX, boundary.minY], [boundary.maxX, boundary.maxY]];
        var point,vertexes = [];
        for (var i = 0; i < mapVertex.length; ++i) {
            var leftAndTop = self.getLeftAndTop(mapVertex[i][0], mapVertex[i][1]);
            point = {
                x: leftAndTop.left,
                y: leftAndTop.top
            };
            vertexes.push([leftAndTop.left, leftAndTop.top]);
            if (pointInPolygon(point, clientVertex)) {
                mapVertexIsInBoundary = true;
                break
            }
        }
        for (var j = 0; j < clientVertex.length; ++j) {
            point = {
                x: clientVertex[j][0],
                y: clientVertex[j][1]
            };
            if (pointInPolygon(point, vertexes)) {
                mapVertexIsInBoundary = true;
                break
            }
        }
        if (!mapVertexIsInBoundary) {
            var hasCrossOverPoint = function(line, vertex, boundary) {
                var i,
                    polySides = vertex.length,
                    j = polySides - 1,
                    oddNodes = false,
                    slope;
                for (i = 0; i < polySides; ++i) {
                    if ((vertex[j][1] == vertex[i][1])) {
                        if (line.type == 'X') {
                            if ((line.val <= vertex[j][1] && line.val >= vertex[i][1]) || line.val <= vertex[i][1] && line.val >= vertex[j][1]) {
                                oddNodes = true;
                                break;
                            }
                        } else {
                            continue;
                        }
                    } else if ((vertex[j][0] == vertex[i][0])) {
                        if (line.type == 'Y') {
                            if ((line.val <= vertex[j][0] && line.val >= vertex[i][0]) || line.val <= vertex[i][0] && line.val >= vertex[j][0]) {
                                oddNodes = true;
                                break;
                            }
                        } else {
                            continue;
                        }
                    } else {
                        slope = (vertex[j][0] - vertex[i][0]) / (vertex[j][1] - vertex[i][1]);
                        if (line.type == 'X') {
                            var crossX = vertex[i][0] + (line.val - vertex[i][1]) * slope;
                            if ((crossX <= vertex[i][0] && crossX >= vertex[j][0]) || (crossX >= vertex[i][0] && crossX <= vertex[j][0])) {
                                if (crossX <= boundary.maxX && crossX >= boundary.minX) {
                                    oddNodes = true;
                                    break;
                                }
                            }
                        } else {
                            var crossY = vertex[i][1] + (line.val - vertex[i][0]) / slope;
                            if ((crossY <= vertex[i][1] && crossY >= vertex[j][1]) || (crossY >= vertex[i][1] && crossY <= vertex[j][1])) {
                                if (crossY <= boundary.maxY && crossX >= boundary.minY) {
                                    oddNodes = true;
                                    break;
                                }
                            }
                        }
                    }
                    j = i
                }
                return oddNodes;
            };
            for (var k = 0; k < lines.length; ++k) {
                if (hasCrossOverPoint(lines[k], vertexes, boundary)) {
                    mapCrossOverBoundary = true;
                    break;
                }
            }
            if (!mapCrossOverBoundary) {
                console.log('outing!!!');
                var timerId = setTimeout(function(){
                    self.moveToCenter(true);
                    clearTimeout(timerId);
                },200);

            }
        }
    };
    p.setFloor = function(floorName) {
        var self = this;
        self.curFloor = floorName;
        if (floorName in self.svg.floors) {
            self._initMap();
            self._initMarker();
            self._bufferUIStop();
            self._initFloor(self.curFloor);
        } else {
            //self._getLocalFloorData(floorName);
            self._getFloorData(self.floorObj[floorName], function(res){
                if(res){
                    self._setFloorJSON(self._floorData);
                    self._initFloor(self.curFloor);
                }else{
                    console.log('no map data!');
                }
            });
        }
    };
    p._setFloorJSON = function(floorData) {
        var self = this,
            data = {
                name: floorData[1] || '',
                width: floorData[4] || 0,
                height: floorData[5] || 0,
                floor: floorData[6] || '',
                shopShapes: floorData[7] || [],
                shops: floorData[8] || [],
                fac: floorData[9] || [],
                text: floorData[10] || []
            };
        self.curFloor = data.name;
        self.svg.floors[self.curFloor] = data;
        self._initMap();
        self._initMarker();
        self._bufferUIStop()
    };
    p._initMap = function() {
        var self = this;
        self._initDomStyle();
        self._draw(self.curFloor);
        self.zoomTo(self._initZoomLv);
        self._setFontDivSize();
        self.moveToCenter(false);
    };

})(Atlas);
var NOOP = function () {};

(function(global){
    var p = global.prototype;
    p._addText = function() {
        var self = this,
            floor = self.curFloor,
            texts = self.svg.floors[floor].text;
        texts.forEach(function(text) {
            var marker = {
                type: 'text',
                x: text[0],
                y: text[1],
                text: [3],
                coordinate: text[0] + '&' + text[1]
            };
            self._setMarker(marker);
        })
    };
    p._addFac = function() {
        var self = this,
            floor = self.curFloor,
            facs = self.svg.floors[floor].fac;
        facs.forEach(function(fac) {
            if(fac[5] == undefined || !fac[5]){
                var marker = {
                    type: 'fac',
                    x: fac[0],
                    y: fac[1],
                    className: 'atlas ' + self.icons[fac[3]],
                    title: fac[4] || '',
                    coordinate: fac[0] + '&' + fac[1],
                    id: fac[3]
                };
                self._setMarker(marker);
            }
        })
    };
    p._addShop = function() {
        var self = this,
            floor = self.curFloor,
            shops = self.svg.floors[floor].shops;
        shops.forEach(function(shop) {
            var marker = {
                type: 'shop',
                x: shop[0],
                y: shop[1],
                text: shop[4],
                coordinate: shop[0] + '&' + shop[1],
                className: 'atlas ' + self.prods[shop[5]],
                id: shop[3]
            };
            self._setMarker(marker);
        })
    };
    p.getMarkerPosition = function(x, y , zoom){
        var self = this,
            zoom = zoom || 1,
            left = ((+x) * self.__svgScale  + self.__svgOriginalLeft) * zoom - 10,
            top = ((+y) * self.__svgScale + self.__svgOriginalTop) * zoom - 10;
        return {left: Math.round(left), top: Math.round(top)};
    };
    p._setMarker2 = function(marker){
        var self = this,
            item;
        item = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        item.setAttribute('x', marker.x * self.__svgScale * 2);
        item.setAttribute('y', marker.y * self.__svgScale * 2);
        item.setAttribute('transform', 'scale(' + (1 /(self.__svgScale * 2)) + ')');
        item.setAttribute('className', 'atlas-' + marker.type);
        item.setAttribute('coordinate', marker.coordinate);
        item.style['cursor'] = 'pointer';
        item.textContent = marker.text || marker.title;
        item.innerHTML = marker.text || marker.title;

        self.gDom.appendChild(item);
    };
    p._setMarker = function(marker) {
        var self = this,
            textDiv = self.textDiv,
            pos = self.getMarkerPosition(marker.x, marker.y),
            left = pos.left,
            top = pos.top,
            item;
        item = document.createElement('div');
        if (marker.type == 'fac') {
            item.className = marker.className + ' atlas-fac';
            item.setAttribute('title', marker.title);
            item.setAttribute('facId', marker.id)
        }
        if (marker.type == 'shop') {
            item.className = 'atlas-shop';
            item.setAttribute('poiId', marker.id);
            item.innerHTML = '<b class="' + marker.className + '"></b><strong class="shopText"> ' + marker.text + '</strong>'
        }
        item.style.cssText = "position:absolute;display:none;top:" + top + "px; left:" + left + "px;z-index:" + self.__mapZIndex.poi;
        item.setAttribute('coordinate', marker.coordinate);
        textDiv.appendChild(item);
    };
    p._getFilterData = function() {
        var self = this,
            scale = self.scroller.__zoomLevel,
            data = self._mapDataForEmphasizeMark || self.svg.floors[self.curFloor];
        self._filterData[self.curFloor] = self._filterMark({
            data: data,
            distance:  Math.round(60 / scale / self.__svgScale),
            scale: scale,
            center: [self._mapCenter.x, self._mapCenter.y]
        });
        return self._filterData[self.curFloor]
    };
    p._initMarker = function() {
        var self = this;
        self.resetMark();
        self._setFontDivSize();
    };
    p.resetMark = function() {
        var self = this;
        self._removeEmphasize();
        self.removeTag();
        self.removeImgs();
        self.textDiv.innerHTML = '';
        self._addText();
        self._addFac();
        self._addShop();
        self._markBehavior();
        if(self.__navigation){
            self.setNavigationUI(self.__navigation.x, self.__navigation.y, self.__navigation.radius);
        }
        self.__poiDivs = self.textDiv.children;
    };
    p._markBehavior = function() {
        var self = this,
            marks = self.textDiv.children,
            evt,
            beginTime,
            endTime;
        for (var i = 0; i < marks.length; ++i) {
            if ('ontouchstart' in window) {
                evt = 'touchend'
            } else {
                evt = 'mouseup'
            }
            marks[i].addEventListener(evt,
                function(e) {
                    if(e.preventDefault){
                        e.preventDefault();
                    }
                    endTime = e.timeStamp;
                    if (endTime - beginTime >= 300) {
                        return
                    }
                    var coordinate = this.getAttribute('coordinate');
                    if (coordinate) {
                        var markX = coordinate.split('&')[0],
                            markY = coordinate.split('&')[1];
                        self.moveTo(markX, markY);
                        self.tagTo(markX, markY);

                        if(!self.scroller.__didDecelerationComplete){
                            var timerId = setTimeout(function(){
                                self.moveTo(markX, markY);
                                clearTimeout(timerId);
                            },100);
                        }
                    }
                    self._markAction(this);
                    e.stopPropagation();
                },
                false);
            marks[i].addEventListener('mousedown',
                function(e) {
                    if(e.preventDefault){
                        e.preventDefault();
                    }
                    beginTime = e.timeStamp;
                    e.stopPropagation();
                });
            marks[i].addEventListener('touchstart',
                function(e) {
                    if(e.preventDefault){
                        e.preventDefault();
                    }
                    beginTime = e.timeStamp;
                    //e.stopPropagation();
                });
            marks[i].addEventListener('click',
                function(e) {
                    if(e.preventDefault){
                        e.preventDefault();
                    }
                    e.stopPropagation();
                })
        }
    };
    p._imgBehavior = function(obj, action) {
        var evt;
        if ('ontouchstart' in window) {
            evt = 'touchstart';
        } else {
            evt = 'mouseup';
        }
        obj.addEventListener(evt,
            function(e) {
                if(e.preventDefault){
                    e.preventDefault();
                }
                action();
                //e.stopPropagation();
            },
            false);
        obj.addEventListener('mousedown',
            function(e) {
                if(e.preventDefault){
                    e.preventDefault();
                }
                e.stopPropagation();
            },
            false);
        obj.addEventListener('click',
            function(e) {
                if(e.preventDefault){
                    e.preventDefault();
                }
                e.stopPropagation();
            },
            false);
    };
    p.tagTo = function(x, y, action) {
        var self = this,
            tag;
        self.removeTag();
        tag = {
            x: parseFloat(x),
            y: parseFloat(y),
            width: 22,
            height: 30,
            path: self._tagPath,
            className: "atlas-tag",
            zIndex: self.__mapZIndex.tag,
            action: action || NOOP
        };
        self._addImage(tag);
        self._setFontDivSize();
    };
    p.tagToPoiId = function(poiId) {
        var self = this,
            selector = 'div[poiId="' + poiId + '"]',
            curDom = self.textDiv.querySelector(selector);
        if (curDom) {
            var coordinate = curDom.getAttribute('coordinate').split('&');
            self.tagTo(coordinate[0], coordinate[1]);
        } else {
            console.log('Not found poi with id( "' + poiId + '" )!');
        }
    };
    p.removeTag = function() {
        var self = this,
            selector = 'div.atlas-tag',
            tag = self.textDiv.querySelector(selector);
        if (tag) {
            try{
                self.textDiv.removeChild(tag);
            }catch(e){}
        }
    };
    p.removeImgs = function() {
        var self = this,
            selector = 'div.atlas-img',
            img = self.textDiv.querySelectorAll(selector);
        if (img) {
            for (var i = 0; i < img.length; ++i) {
                self.textDiv.removeChild(img[i]);
            }
        }
    };
    p.addImgs = function(imgItems) {
        var self = this;
        if (imgItems instanceof Array) {
            imgItems.forEach(function(item) {
                var pic = {
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                    path: item.url,
                    className: 'atlas-img',
                    action: item.action || NOOP
                };
                self._addImage(pic);
            });
            self._setFontDivSize();
        }
    };
    p._addImage = function(pic) {
        var self = this,
            item = document.createElement('div'),
            pos = self.getMarkerPosition(pic.x, pic.y),
            left = pos.left,
            top = pos.top;
        item.className = pic.className;
        item.setAttribute('coordinate', pic.x + '&' + pic.y);
        item.style.cssText = "position:absolute;width:" + pic.width + "px;height:" + pic.height + "px;background:url(" + pic.path + ") no-repeat;background-size:" + pic.width + "px " + pic.height + "px ; top:" + top + "px; left:" + left + "px;z-index:" + (pic.zIndex|| self.__mapZIndex.img);
        self.textDiv.appendChild(item);
        self._imgBehavior(item, pic.action);
        return item
    };
    p.enFacility = function(list) {
        var self = this;
        self._initMarker();
        if (list instanceof Array) {
            if (list.length > 0) {
                self._emphasizeFac(list);
            }
        } else {
            self._emphasizeFac([list]);
        }
    };
    p._emphasizeFac = function(types) {
        var self = this,
            data = JSON.stringify(self.svg.floors[self.curFloor]),
            tempData = JSON.parse(data),
            facs = tempData.fac;
        var inArray = function(arr, item) {
            if (! (arr instanceof Array) && arr.length == 0) {
                return false;
            }
            var flag = false;
            for (var i = 0; i < arr.length; i++) {
                if (parseInt(arr[i]) == parseInt(item)) {
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        types.forEach(function(item) {
            var selector = 'div[facId="' + item + '"]';
            var doms = self.textDiv.querySelectorAll(selector);
            if (doms) {
                for (var i = 0,len = doms.length; i < len; ++i) {
                    var className = doms[i].className;
                    if (className.indexOf('emphasize') > -1) {
                        className = className.replace(/(emphasize)+/gi, '');
                    }
                    doms[i].className = className + ' emphasize';
                }
            }
        });
        facs.forEach(function(fac) {
            if (inArray(types, fac[3])) {
                fac[2] = 100;
            }
        });
        tempData.fac = facs;
        self._clearFilterCache(self.curFloor);
        self._mapDataForEmphasizeMark = tempData;
        self.zoomTo(self._initZoomLv);
        self.moveToCenter();
        self._setFontDivSize();
    };
    p._removeEmphasize = function() {
        var self = this,
            selector = 'div.emphasize',
            doms = self.textDiv.querySelectorAll(selector);
        self._clearFilterCache(self.curFloor);
        self._mapDataForEmphasizeMark = null;
        if (doms) {
            for (var i = 0; i < doms.length; ++i) {
                var className = doms[i].className;
                doms[i].className = className.replace(/(emphasize)+/gi, '')
            }
        }
    };
    p._clearFilterCache = function(curfloor) {
        var self = this;
        if (curfloor) {
            self._filtered[curfloor] = null;
            self._filterDistance[curfloor] = null;
            self._filterScale[curfloor] = null
        } else {
            self._filtered = {};
            self._filterDistance = {};
            self._filterScale = {};
        }
    };
    p._filterMark = function(options) {
        var self = this,
            mapData = options['data'] || {},
            distance = options['distance'] || null,
            scale = options['scale'] || null,
            center = options['center'] || [],
            floorName = mapData.name,
            marks;
        if ( (scale  >= self.scroller.options.maxZoom) || (distance == 0)) {
            return mapData.shops.concat(mapData.fac).concat(mapData.text)
        }

        var proxy = [],
            filtered = [],
            center = center || {};
        var inArray = function(arr, item) {
            if (!arr.length || arr.length == 0) {
                return false;
            }
            var flag = false;
            for (var i in arr) {
                if (arr[i] == item || (arr[i][0] == item[0] && arr[i][1] == item[1])) {
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        var getDistance = function(a, b) {
            return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]))
        };
        var clearNear = function(list, proxy) {
            proxy.forEach(function(item) {
                var tempList = [];
                for (var i in list) {
                    var pointSpace = getDistance(item, list[i]);
                    if (pointSpace > distance) {
                        tempList.push(list[i]);
                    }
                }
                list = tempList;
            });
            return list;
        };
        var checkDistance = function(list, proxy, filtered) {
            while (list.length > 0) {
                list = clearNear(list, proxy);
                if (list.length > 0) {
                    proxy = [list[0]];
                    filtered = filtered.concat(proxy);
                }
                list.splice(0, 1);
            }
            return filtered;
        };
        var mySort = function(a, b) {
            var diff = parseFloat(b[2]) - parseFloat(a[2]);
            if (diff !== 0) {
                return diff;
            } else {
                if (center && center.length == 2) {
                    return getDistance(a, center) - getDistance(b, center);
                } else {
                    return parseFloat(b[0]) - parseFloat(a[0]);
                }
            }
        };
        if (self._filtered[floorName] && self._filterDistance[floorName] && self._filterDistance[floorName] > distance) {
            proxy = self._filtered[floorName];
            filtered = self._filtered[floorName];
            marks = mapData.shops.concat(mapData.fac).concat(mapData.text);
            if (proxy.length < marks.length) {
                var newMarks = [];
                for (var i in marks) {
                    if (inArray(proxy, marks[i])) {
                        continue;
                    } else {
                        newMarks.push(marks[i]);
                    }
                }
                marks = newMarks;
                filtered = checkDistance(marks, proxy, filtered);
            } else {
                filtered = marks;
            }
        } else {
            if (self._filtered[floorName] && self._filterDistance[floorName] && self._filterDistance[floorName] <= distance) {
                marks = self._filtered[floorName];
            } else {
                marks = mapData.shops.concat(mapData.fac).concat(mapData.text);
            }
            marks = marks.sort(mySort);
            var markLen = marks.length,
                index;
            for (var i in marks) {
                if (parseFloat(marks[i][2]) < 100) {
                    index = i;
                    break;
                } else {
                    filtered.push(marks[i]);
                    proxy.push(marks[i]);
                }
            }
            if (index && index > 0) {
                marks.splice(0, index);
            }
            if (proxy.length < markLen) {
                filtered = checkDistance(marks, proxy, filtered);
            } else {
                filtered = marks;
            }
        }
        self._filtered[floorName] = filtered;
        self._filterDistance[floorName] = distance;
        self._filterScale[floorName] = scale;
        return filtered;
    };
    p._setFontDivSize = function(){
        var  self = this,
            zoom = self.scroller.__zoomLevel,
            poiDivs = self.__poiDivs || [],
            filtered = self._getFilterData(),
            degree = -self.scroller.__rotateDegree;
        var isInFiltered = function(coord, filtered){
            var len = filtered.length || 0,
                flag = false,
                item, tempStr;
            for(var i = 0; i < len; ++i){
                item = filtered[i];
                tempStr = item[0] + '&' + item[1];
                if(tempStr == coord){
                    flag = true;
                    break;
                }
            }
            return flag;
        };
        for(var i = 0, len = poiDivs.length; i < len; ++i){
            var curDom = poiDivs[i],
                coordinate = curDom.getAttribute('coordinate'),
                className = curDom.className,
                isTag = (className.indexOf('atlas-tag') > -1) ? true : false,
                isImg = (className.indexOf('atlas-img') > -1) ? true : false;
            if(self.__navigation && curDom == self.__navigation.dom){
                continue;
            }
            if(!isTag && !isImg && !isInFiltered(coordinate, filtered)){
                curDom.style['display'] = 'none';
            }else{
                coordinate = coordinate.split('&');
                var position = self.getMarkerPosition(coordinate[0], coordinate[1], zoom);
                curDom.style['left'] = position.left + 'px';
                curDom.style['top'] = position.top + 'px';
                curDom.style['display'] = '';
                //self._setTransform(curDom, degree, isTag)
                curDom.style[self.__vendorPrefix + 'TransformOrigin'] = '50% 50%';
                if(isTag || isImg){
                    var diffHeight = curDom.offsetHeight / 2,
                        cos = Math.cos(-degree * Math.PI / 180),
                        sin = Math.sin(-degree * Math.PI / 180),
                        diffTop = Math.round(-diffHeight * cos ) - (diffHeight - 10),// 5 = tag的高度/2（30） - poi的高度/2（20）; 10=poi的高度/2
                        diffLeft = Math.round(-diffHeight * sin);
                    curDom.style[self.__vendorPrefix + 'Transform'] = 'translate('+(diffLeft) +'px,'+(diffTop) +'px) rotate(' + degree +'deg)';
                }else{
                    curDom.style[self.__vendorPrefix + 'Transform'] = 'rotate(' + degree +'deg)';
                }
            }
        }
    };

    p._setTransform = function(obj, deg, isTag) {
        var self = this,
            perspectiveProperty = self.__vendorPrefix + "Perspective",
            transformProperty = self.__vendorPrefix + "Transform",
            diffHeight, diffTop, diffLeft;
        if (isTag) {
            diffHeight = 18;
            diffTop = -diffHeight * Math.cos(-deg * Math.PI / 180);
            diffLeft = -diffHeight * Math.sin(-deg * Math.PI / 180);
        }else{
            diffTop = 0;
            diffLeft = 0;
        }
        if(obj.style[perspectiveProperty] !== undefined){
            obj.style[self.__vendorPrefix + 'Transform'] = 'translate3d(' +(diffLeft) + 'px,'+(diffTop) +'px,0) rotate(' + deg +'deg)';
        }else if(obj.style[transformProperty] !== undefined){
            obj.style[self.__vendorPrefix + 'Transform'] = 'translate('+(diffLeft) +'px,'+(diffTop) +'px) rotate(' + deg +'deg)';
        }
        obj.style[self.__vendorPrefix + 'TransformOrigin'] = '50% 50%';
    };

    p._hiddenPoiDiv = function(){
        var  self = this,
            poiDivs = self.__poiDivs;
        if(poiDivs && poiDivs.length){
            for(var i= 0,len=poiDivs.length; i<len; ++i){
                if(self.__navigation && poiDivs[i] == self.__navigation.dom){
                    continue;
                }
                poiDivs[i].style['display'] = 'none';
            }
        }
    };
    p.setNavigationUI = function(x, y, radius){
        var self = this,
            zoom = self.scroller.__zoomLevel,
            rootDiv,circleDiv,arrowsDiv;
        if(self.__navigation == undefined || !self.__navigation){
            rootDiv = document.createElement('div');
            circleDiv = document.createElement('div');
            arrowsDiv = document.createElement('div');
            rootDiv.appendChild(circleDiv);
            rootDiv.appendChild(arrowsDiv);
            var diameter = Math.round(radius * zoom / 2),
                initRadius = Math.round(diameter / 2);
            var position = self.getMarkerPosition(x, y, zoom),
                left = +position.left - diameter / 2,
                top = +position.top - diameter / 2;
            var rootStyle = 'width:auto;height:auto;display:inline-block;position: absolute;left:' + (left) + 'px;top:' + top + 'px;z-index:;' + self.__mapZIndex.nav;
            var circleStyle = 'width:' + diameter + 'px;height:' + diameter + 'px;border-radius:' + diameter + 'px;background-color:#B2D8E5;opacity: 0.5;';
            var arrowsStyle = 'left:'+ (initRadius - 8) +'px; top:'+ (initRadius - 8) +'px;width:18px;height:18px;position:absolute;background:url("http://atlassdk.qiniudn.com/img/icon-arrow.png") no-repeat;background-size: 16px 16px;background-position:center;';

            rootDiv.setAttribute('style', rootStyle);
            circleDiv.setAttribute('style', circleStyle);
            arrowsDiv.setAttribute('style', arrowsStyle);
            self.textDiv.appendChild(rootDiv);
            self.__navigation = {
                dom: rootDiv,
                circle: circleDiv,
                arrows: arrowsDiv,
                x: x,
                y: y,
                radius: radius
            };
            if(window.DeviceOrientationEvent) {
                window.addEventListener('deviceorientation', function(event) {
                    var alpha;
                    if(event.webkitCompassHeading) {
                        alpha = event.webkitCompassHeading;
                        rootDiv.style.WebkitTransform = 'rotate(' + (alpha - 180) + 'deg)';
                    }
                    else {
                        alpha = event.alpha;
                        rootDiv.style[self.__vendorPrefix + 'Transform'] = 'rotate(-' + alpha + 'deg)';
                    }
                }, false);
            }
        }else{
            self.textDiv.appendChild(self.__navigation.dom);
        }
    };
    p._updateNavigation = function(){
        var self = this,
            zoom = self.scroller.__zoomLevel;
        if(self.__navigation == undefined || !self.__navigation){
            return;
        }else{
            var navigation = self.__navigation.dom,
                circle = self.__navigation.circle,
                arrows = self.__navigation.arrows,
                x = self.__navigation.x,
                y = self.__navigation.y,
                radius = self.__navigation.radius;
            var diameter = Math.round(radius * zoom / 2),
                initRadius = Math.round(diameter / 2),
                offset = initRadius - 9;
            var position = self.getMarkerPosition(x, y, zoom),
                left = +position.left - diameter / 2,
                top = +position.top - diameter / 2;
            navigation.style['left'] = left + 'px';
            navigation.style['top'] = top + 'px';
            navigation.style['display'] = '';
            circle.style['width'] = diameter + 'px';
            circle.style['height'] = diameter + 'px';
            circle.style['border-radius'] = diameter + 'px';

            arrows.style['left'] = offset + 'px';
            arrows.style['top'] = offset + 'px';
        }
    }
})(Atlas);