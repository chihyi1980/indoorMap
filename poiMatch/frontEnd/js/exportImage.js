 window.IndoorMap = window.IndoorMap || {}, function(a) {
    var b = function() {
            this.options = {
                defaultStyle: {
                    outerFrame: {
                        stroke: "#A56D57"
                    },
                    shape: {
                        stroke: "#e1cdb9",
                        fill: "#f9f3e9"
                    },
                    noopShape: {
                        stroke: "958E97",
                        fill: "#C6C4C4"
                    }
                },
                mWidth: 0,
                mHeight: 0,
                mCenter: {},
                outerFrame: {},
                shapes: [],
                layers: {},
                drawScale: 1,
                initDeg: 0
            }
        },
        c = function(a, b, c) {
            var d = document.createElement("img");
            b && (d.width = b), c && (d.height = c), d.src = a;
            var e = !1;
            return d.onload = function() {
                e = !0
            }, d
        },
        d = {
            8: c("data:image/png;base64,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"),
            16: c("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAC4jAAAuIwF4pT92AAAE+ElEQVR42u1WfVBUVRR/u0ukBAMZDciYoNI0hoM6QF82hRmWZUxTIx9SUA5mMboIM8jHvvfue7tvd9ld9ot1vz/YGRKxMDQ1MYQQARFhSvKjP2umcWzGfxojHUVe5+7bdR+k5R/N+Ef8cea+e+8593fO75x77iMYhiEehhDzwP8nYCQakWg+d+1B5H7nRdcedsSCNwiFviUMQ8tApPdeC42ib7yH7SPrSBK2IZjIGLWTRrDgYCF8YQQgSknQpIqgKVUENLp2D0E0GxKa5MJzZTgIkLDjd/VFZ4oipkMbWvuHL1g686sNbYVbEEtKaThU5y5eb96/odb0+Ru7zB0b5eaOAjl8yy2dr9WozZ+sVBurlsO+HIvWXp5LUyxES0sQzRCsqnGBqX1TpblzQ7XB/24hAhyMFY0UlBhWEeM4mTkSGH+M944m3VKbdqyimjSE7Wh2sO37WN4/lgiSJIxnE/ngDzK+JfhOJThWFJhYyPvGEnjHiWcGaRqfSUkphRo7vdl/Lp73j8fzzm8zTzEMifdkAiXgHaZKY92W6xtdNOXsWz7uG3182rSvoAEbc4ad6RBZttZWnu85vfim67v0n0A3W2OtzGG5hkSdu6jYe2bRbfepJb96hp+cUpu3Z1Eh2hmi9VBeEPb+gPUb9m+yjiGWCuU8TLXgneWLV7T+cwm8IVD4lnsw7So4cDFEN1BHNaqBtvpkz+nUaQC+gMBzSqEisJ3eu6UMHJ2xfb12v+9sEm/qKCDJRi2h1O1O8QylXHX0Zh4B4GuOnpUnGYFqiBg+cNSsqmGBa2Dpz+D1L/hQOKQL06Np/fh5mlJCpdJSVXNNunco5Y57IP2yUl33CEJUDK4LnaeoFNOp971X4ezPuAhyCWwImJf5ICVQL2UAfB2AexlECcAMS8aSCo5odpQVBMbjeGvXS3ZKwT0Kytv9EwvvmA+8qqFJJdBGE0pt7RKIAEd8ieXqZdgZXK16b1EJ5HhGu7d8M+jrAxNxPGf8NN12dHW3q2/ZpMZSuRaYmLEff/aEKGIyBlNp7c7zeoEm73Dqn56h1N+9wylTkBve1Q8g6j3xNMli4Kcg4mn3QMZlVh0Ghoj1nuLStom4GZ3jgyKN7aNciB5oX+P2jiT/Zty3UaEy7MwIjMXzjp6sHkirAIyLQNm8OwlyegUK55r14DrO2vWyEvJNu3pXXMDV3ezYup5sUoNezVLPYNpNV/+yH5XcHimNkISmOKC6uBjAbjU7S7fi1Ln6Ms57RpJveM88cZ0zfraCM+zKhFtw23581bFwxFKCrNcTxvZN8uCkhLcdWdNJNmgJnB9FXQvREny7qm1SykO+v6Kg6iHHGbh43EMpV1h1XShi7Lje935FG9jDuAOfB3SzwfMxvLP36RFIGwFU5wbgOjp7M4eEiOE60VDycBdLbIdzbNq9FXkAKoP7HAt3UabSVS+2HnzRYDqQX8OommSMqiHB8uU6rbkzv5ZVNkKDwBGz+ODVrYdyLPh6ha5fS9Wy1sM5Rp275HWqSS1R6eRprd3P6Yztb24LUy0JdZFIy8OtEYnbnbgVokj74+62vrl6eGTEdqAntE/xnIn0aibcxKkY7Em0sUfG0LpM1Fojj4FYTyLooYh99FFBs+ykomcRzXquBEeio/hNRnPn6O96aJbjc+dRZ+/z+KN/WH8QPeZf5mj+Z28eeB74v5O/ABjLtRrvoJAKAAAAAElFTkSuQmCC"),
            5: c("data:image/png;base64,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"),
            6: c("data:image/png;base64,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"),
            4: c("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAC4jAAAuIwF4pT92AAAFU0lEQVR42q1X20/bdRT/9sKl7aBEQGAwymXgNu6FFKkVx4KazGwaDEtwzAibXGTQiuDm1nO+v7bcF2big3+AUec08cmYOJd4eTDxRU30wUSnLvFle9DEKDgo/Dzn1/5qqYN2xYeTb3+/fH/ncz7nXiGlFIqiCDoNKNFMv41SkSY671WMpMMU1SFIh6Z3O9FBRUAJiJAS0k5dgkowZQlIEjpZRzJQDZgsNARkQJyX53Lc2PBGM1Rfb8Waa07c/3kjVnzZhJVfNCcRvtOC1Z81guOjPuw5NqPMaHp3BPajP2NGmRVDONhe6DepZWBV90K2WoH22w3o+OYgltyowcJfa/H+m7VY9AudiXLzASz6uRryb+f7heqGxvdmlTkBCKYdgUGCOSRnxIg84yoFW7gS8+44IHdtP+R//wR2jb0sp7Jn5SyFQxF+eVGAAsTmXyHDhUIe8+FEXilYVjux9W0mQoyNSYH5YgTYqjowd6MC7JvlkKOWQJZaAwU/HsNuL4XCNi8XBIdFicsDhQwKkWvPyekM8taKB1veZcYEnJRxRhS4nYHJxWEC53OD2IfLYY9aDBkqufLGcez2gfSbuQI4IVkQOUeCYhpfsjDjh9F5lfWRXpN+J1VgYpy7SedmnAHr5H6VY/gUPj4cjaFRL8MgZTKFxEKMVz3o1BizJyi7DXrVpAaMdlWTOAM49sQo3AnO1+JdGSnFIANn7wPbn53ovML6JqXXHpKhWHYngu8MHDPAzgasU7ZvHsa2Zc2VCJrLydVGcrVhCietBX6D2g6HPlyUSwY31r/Vj72d83KRMYyJ4KkBk7C7ucwOY+syM+a48nczlPGR54AYlKeOnMWRxkvKsngImj4uAvMfp+WpJk7KRPA0gNsu830CcIzK56tfkENVLGNyuMonxwvGcbR0XI5WuuDgNb5fDrZbg7K/hcHZ7XpXSwuYy+cQlH1V4s9ao7iuktwhWaPkCpOs87MDclhPeB9VBVXGrQF50h2MxpzB02ZMXe27MrBte5+FK4G+Wyv1W7gcf7ogz1up2fAwSp9xPZR/W+q3svIwA7Bw02HRnys1xjZOzt+oJXtijOUuGPtwvHZCjtV55VlNKL51U3LS8SJO1ExKX92DWHedOx+V5O/D8rR7Lhpjru+0YxxpEAGtVXKt8skKKdnavWTQonJJuKGBk2uFQDvm5LzWyeLndNqM4+rYFK1jW5HfrHZA/QcLVMcebL4ygCe7o6Vk+h/qOML4bp2LMvov6tXvsL5pnMrbfeeKiAb8CLa+SmPUTOMwk9ccZk5uNxPjPWVgWdF7tUyhV8fNY+smZaM+JBIZr1HdqkfQNcediTvWnDIvZuWcWFCWxEV5QfCQiE0nXgSksv10ittAOvaCRRsGNBTYAALfYgA3B5VWok/65NPeXjzuOyGf9J6gs0/2eI9iV5CyeMMDLVeji0DSeWziWFBpVFFd/q2BQx65Oy/siE4n9gDXJRvA4Pkg1II44edCMKo8JLrRvche0MfmtsD6sOamP4JnnG1Q+z7XHwPwIhBbDMC+zjngggNvDskB5wD2u2gAtOpCA6KNzjZyeRaX2nYu3rLe6gnAcQuSAc/hM482QPmnxZCpcudhAzgEHOMudC0sUYw5LziJEoXXoZTW2/j1BBWtnRnYVfyOVtXeA1D8dQkZwK6mRWCd5zGBGjk3eKFLFE3XDkl1V8Z6O9M2RPrNHYdcl9GDR4do6/zhPlp9PND8eirra1LGiS9iFpO72AAe8GzAK7RlPoYeJCOeTWV9vWfgLQYoMQNMvNAxU/67kkoM0wb+jwHU+mi1zYxvlbsB/gdC1W5Q345wUQAAAABJRU5ErkJggg=="),
            1: c("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAC4jAAAuIwF4pT92AAAFTUlEQVR42q1WW2wUZRSevdSW0qYQWwUEaQGptFbuRk2sBiiKgIAJiSRGFCiKGAm0QEt3rrszO9dtu7d2L6VFTEBNFCvog9FgwouJxher0WhsbHihLT7oE5es35nZ0vpgu+324cv8c+ac8/3n/Oc/ZxhBEJipwNOT5xlOENwEWo/JeOe7K4t7sql8ToeU8eMpZdfjBDwj8g7u6edLPJE0wHPMMdFf1iRKpbSeSN4mCIWEWY2YCBCNK8BxTLnRffUBvesrCWuSEQkIPfcbXT9Afs03W8TkgON5tx8R1qhhiwmdzRCq1UgUxPZZtwhiUYGVvFlkJgexCZfIZbMxG6k+wwvubbKxq9BMXgeGX/GrW9t4wUuR05nPMRPXS4zEz6RrR5xD1LmlGgQBnmVKjcRAsZkYokKiLGBD920IdiheK/WPx0r/vUqLGD5e8AgzIZ5YIHR1WAARuFsEocBlpUeZUPr2aUEsxhF4QO5+Xjb3jR3BSwF9F2rBjbP2ku1kxTZpihVEJQNBjrWrepNiNT+nWGfoWpGMvoXZNqZesd5+Rgm924k16SlZTBb5/5Ji154DfuWx1/3BtcAaer4lycuAqrH3LNZBb9UbAK3HvpEt+cg5YkqtivN8UTaQwl47hUx77/Rgp743Qz7IF/mckph2qXE+SmsTY6X/ek1S1jRK8trDklx30K/UNkpKDdarsV5HoPUhyA5KSi3pkC7ZkC35IF925DlFzLLMZtk8zoRSN3xIlQHj46JUtliP96/UIr0crpeCM6ZzRmV7q7TY+w/r8UunBLGEdMmGbMkH+copYtaOGMSKBeL0cLMoFqgc690h63uY9j47hfslZa3Ec15UtedVf3Cjk+K+zO6Ath2b8ZIN2ZIP8sXmGPEY8QkyPg2ZjHv8jugvX6FF04+rYb0VfZmql+5ykyCV1KiR0EotmjwhSGWUBVw3J2L4mCnxTepCOKvDc6z09flG94/zjO6fSs3kbwckpW5vQNtcZKWHIB+AfGCulRrcHdBf5u1Up0fzIR49A9kiPf5xkZkaYqyeDIomU2il/3w6GPKtVjvlEjM16Mh7MtAZXKLHPkQ7zZc4NdLCi0ylFu1aqsU+Aukdl5m6tViPvYemcXpjsL21Tg2fg/wufYNOH3S7W5xUj+QT8Ugrdl+lRRNLtPinTMiJeJEe++BZxTr1BIhrtfBFWw4s0WIXSLdVsCPOi3iUnCzU4+eBL+eayV/nmMk/yo2uy08F2zmkWsT1ugzZ78AvC/T4Z8D51vxTbVe1a59frV+lhS+A5CIG/tU6tdNAi1y9Hy1yfbAjghRfwdleeESL9GFk1mOguPKMOHXjpCh6o2j+SGvnMj3aP89IfIdWeMhEo7CAF2TzGIrvmwVGvP/JYLsagS7Z5HudhtGNPAbHujeoHdHlWuTSfL37262KeQSTyYUJ5GrAxHpIi329UI9d2qh2mDp0T8FHtoHMiNjuXNh9gcmxrvVqR3eVHv28zEh836CYh4g0CGxBdeP8rz1oxK9gc+0gdp2cYef6T6+m4upkfQzurVythfsq9K4v0D73IgsMNsRsk81GXKFPKvXoOeiwHdB1qnqavdqXjRjd6oTLSg0fFf0VSHfFm5K8ApNnJYqq5qgUWNosShWEI1KgEtPpUaAaOstJl2zIdlM21blPJxRNg2wetIeC1XPHma/07LkN3ALujv3uOGtbftvROZu16cvAxwHylVPEvPMfTY2+eI+sb9kpG9t3yjpg7CDsyD4duQ1bNi63dbeTLfkQp/vPRQYqps84WEabAqqNcRtxJv9cvHPeBflgsr/MfwF1dbzNUh1fcgAAAABJRU5ErkJggg=="),
            3: c("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAC4jAAAuIwF4pT92AAAE4klEQVR42u2XfWwTdRjH71oGVNq1w0QQnRLDiIxARGC+JL4kigmCYmKiQ9BMJIYpEHQDtr7cXa+3bu3WbW3Xzq29tots8Y8mU3whJmIyZbqoCSIqMShaSLax4tiIgFu7nc/zu7Zr98KKCdE/+OPJ3W73+31+z/N8n+9tFMdx1H8R1E3wzMFSLEuutJlj6LSfbyR4AmJkLJSesSaA8PxGZswm4AaAOoU9+WJNyVqGNacOk7xCJZTTBVZpcnWyPCFD6xmB8la9Xtgn5vUPB+dKnzRseEtvEiiOZRRYehPLUxWmaqqSyQx8ZmIteKgMeFZgM2dSHDTVUJ2OZ7ZfaVNIF4PzpVPv3NOFFeBZYw4eys6Xaz+s3/jq585HrJ85H7NhHHU+av+08Ymyesu+xfgOJJBqTdY9xtIKnF79TdN9bb+3LunxVe9YZ2LMCtywwbJ3WcS3+NSlUI40BIcaDsmB95egOn3+hRFPVemyBJy+TjBHWTi96mv3Ws/plruOtlh3rtlvtFMNwt6Cs75FZ/4MLEDASL+YF0uPXv/Cq0PBedJ3ntXteqaKtAb3y7bHUOpqqt3+4vN/hZQSZnbcuzJcy799xznfbRGEImQgoJXOi7rxgYBOwsD786I2Hg1o4r+25J+APpMEsgZDj5UVMEKHbMXbBgOqOGwWg3Kf/KP19p+nQrUA08WnZryq419lXGGyYsYvDQVV433+vFg0kCthAGSMQEmW2nGAjQ0GF0B/VSBCFekxwPvcwhvLUYzX0WOWnBIypt+1bd16MaCCzXVxBCag4wQqEmh8MHiL9EPzveFu9/rGnqY1LlA51yjsWUqyzVrVrGwOPGecUw5CCtc99woqFTNO9hCzRSg8G8X5PuYu4tDdKqFCCMM5Ns42xyyb7r8sLbuRSYnCgvFZAao9MyDmYqbxJBSvMnSe1O0uMhtgZEBASlyXhXNl2J4CZxZPiW50AIwDoSCoc9GAOtVTGTqR6Vfu9YKR4WEfZi4P0OlgU7yaTYNXgnoFs17psOzT2vhyTajm5XXQ07MwEqBeXSwlpAQUxfOF6yF9mbGWwsrgB0S2Sf6aH5H0jGlwIupIw5NlEd+iX6Csvb3+W3svBDSjU9SbBu1yPqx3Crvzv/Ws7uhpur/9S9eDrSCsJnh2N1YgqeIZwPK4fODYtP0yGERU1JBSJoDTQodDpLyWA0Yb5a8uefy31ju/P92S/xP6+N9tlNRZt7kEMzeTss8MplGJJ5uXd4EhjPX7daMJI0AXItd0KBpCt6uII97LMjk4nxhgi+/B+jjESLh2yzZUNiZ1LTAR04/NBccuBNRxAMeS4DQ3GksKSVavBadgjgmECGOXc8K74iO0007H5tfgvZH3HZt2HswiY1LqIw0bSnFxfwKYKLM8r2IueDTMqeuBFBRCwXMG9XFv4eErbbR0yF68Eb04Kqovh+u2FFfMnjH5+tDoUJCNAxQ8PCBqwNxzx0nAPdhe5OP6p96UoZwiOd+HHU/vuAo97bC/8Cx+s/G5S9i9FCZjPpPtOJH5lf+8WeKx7lrVVFW6EgPuC238fjU6EWRJyzYqvw9/AOR5rbsK8HfoATiSRmIi5qzHKelYClxogI0M5Crf41yaOfnLgu8mD4vPDUkol+l6sxpIBpxNLZwckzbKtNeJtTf/k/ifgf8BWWMcNjdPpIMAAAAASUVORK5CYII="),
            2: c("data:image/png;base64,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")
        },
        e = {};
    for (var f in d) e[f] = d[f];
    e[9] = e[10] = d[8];
    var g = {
        initDrawData: function(a) {
            var b = this;
            for (var c in a) b.options[c] = a[c]
        },
        initContext: function(a) {
            a.globalCompositeOperation = "source-over", a.imageSmoothingEnabled = !0, a.mozImageSmoothingEnabled = !0, a.msImageSmoothingEnabled = !0
        },
        createPath: function(a) {
            var b;
            if (a && "path" == a.type) b = new Path2D(a.d);
            else if (a && "rect" == a.type) b = new Path2D, b.rect(a.x, a.y, a.width, a.height);
            else if (a && "arc" == a.type) if (b = new Path2D, b.ellipse) b.ellipse(a.x, a.y + a.height / 2, Math.floor(a.width / 2) + 2, Math.floor(a.height / 2) + 2, 0, 0, 2 * Math.PI);
            else {
                var c = {
                    x: a.x,
                    y: a.y + a.height / 2
                };
                if (a.height == a.width || Math.abs(a.height - a.width) < 1) b.arc(c.x, c.y, Math.floor(a.height / 2) + 2, 0, 2 * Math.PI);
                else {
                    var d = {
                            x: a.x - a.width / 2,
                            y: a.y
                        },
                        e = {
                            x: a.x - a.width / 2,
                            y: a.y + a.height
                        },
                        f = {
                            x: a.x + a.height,
                            y: a.y
                        },
                        g = {
                            x: a.x + a.height,
                            y: a.y + a.height
                        };
                    b.moveTo(d.x, d.y), b.lineTo(e.x, e.y), b.lineTo(g.x, g.y), b.lineTo(f.x, f.y), b.closePath()
                }
            }
            return b
        },
        getBaseMap: function() {
            var a = this,
                b = a.options.mWidth,
                c = a.options.mHeight,
                d = a.options.drawScale;
            if (isNaN(b) || isNaN(c)) throw new Error("Invalid value of width or height.");
            if (0 >= b || 0 >= c) throw new Error("Invalid value of width or height.");
            var e = a.options.outerFrame,
                f = a.options.shapes,
                g = document.createElement("canvas"),
                h = g.getContext("2d");
            a.initContext(h), g.width = b * d, g.height = c * d, h.strokeStyle = a.options.defaultStyle.outerFrame.stroke, h.save(), h.scale(d, d), h.lineWidth = 3 / d;
            var i = a.createPath(e);
            h.stroke(i), h.strokeStyle = a.options.defaultStyle.shape.stroke, h.fillStyle = a.options.defaultStyle.shape.fill;
            for (var j = 0; j < f.length; j++) {
                h.save(), h.lineWidth = 1 / d;
                var k = a.createPath(f[j]);
                f[j].style && (null != f[j].style.opacity && (h.globalAlpha = f[j].style.opacity), null != f[j].style.stroke && (h.strokeStyle = f[j].style.stroke), null != f[j].style.fill && (h.fillStyle = f[j].style.fill), null != f[j].style.rotate && (h.translate(f[j].style.rotate[1], f[j].style.rotate[2]), h.rotate(f[j].style.rotate[0] / 180 * Math.PI), h.translate(-f[j].style.rotate[1], -f[j].style.rotate[2]))), h.fill(k), h.stroke(k), h.restore()
            }
            return g
        },
        getLayerCanvas: function(a) {
            null == a && (a = "11pt 黑体");
            var b = this,
                c = b.options.mWidth,
                d = b.options.mHeight,
                e = b.options.initDeg,
                f = b.options.drawScale,
                g = b.options.layers.fac || [],
                h = b.options.layers.shops || [],
                i = b.options.layers.text || [],
                j = g.concat(h).concat(i),
                k = document.createElement("canvas"),
                l = k.getContext("2d");
            k.width = c * f, k.height = d * f, b.initContext(l);
            for (var m = 0; m < j.length; ++m) {
                var n = j[m],
                    o = b.getLayerShape(n, f, l);
                if (o) {
                    var p = b.createPath(o);
                    l.save();
                    var q = -o.width / 2;
                    if (0 !== e && (l.translate(o.x, o.y + o.height / 2), l.rotate(-e / 180 * Math.PI), l.translate(-o.x, -o.y - o.height / 2)), "shop" === o.layerType) l.save(), l.shadowColor = "#FFFFFF", l.shadowOffsetX = -1, l.shadowOffsetY = -1, l.shadowBlur = 0, 0 !== e ? (l.font = a, l.fillStyle = "#2c2c2c", l.fillText(o.text, o.x + q, o.y + 28), l.fillText(o.text, o.x + q, o.y + 28), l.fillText(o.text, o.x + q, o.y + 28), l.fillText(o.text, o.x + q, o.y + 28)) : (l.font = a, l.fillStyle = "#2c2c2c", l.fillText(o.text, o.x + q, o.y + 28)), l.restore();
                    else if ("fac" === o.layerType) {
                        if (!o.icon) continue;
                        o.text.indexOf("emphasize") > -1 ? (l.save(), l.strokeStyle = "#FF0000", l.lineWidth = 1, l.fillStyle = "#FFFFFF", l.fill(p), l.stroke(p), l.restore()) : (l.save(), l.globalAlpha = .8, l.fillStyle = "#EDF5ED", l.fill(p), l.globalAlpha = 1, l.restore()), l.drawImage(o.icon, o.x + q, o.y, 20, 20)
                    } else "text" === o.layerType && (l.shadowColor = "#FFFFFF", l.shadowOffsetX = -1, l.shadowOffsetY = -1, l.shadowBlur = 0, 0 !== e ? (l.font = a, l.fillStyle = "#2c2c2c", l.fillText(o.text, o.x + q, o.y + 14), l.fillText(o.text, o.x + q, o.y + 14)) : (l.font = a, l.fillStyle = "#2c2c2c", l.fillText(o.text, o.x + q, o.y + 14)));
                    l.restore()
                }
            }
            return b.options.showScale && (l.font = "12px bold", l.fillStyle = "#467EA2", l.fillText("scale：" + f, 0, Math.floor(d * f - 5))), k
        },
        getLayerShape: function(a, b, c) {
            var d;
            return a.length && 6 === a.length ? d = {
                type: "arc",
                x: +(a[0] * b).toFixed(0),
                y: +(a[1] * b).toFixed(0),
                width: null != c ? c.measureText(a[4]).width : 50,
                height: 30,
                text: a[4],
                icon: null,
                layerType: "shop"
            } : a.length && 5 === a.length ? d = {
                type: "arc",
                x: +(a[0] * b).toFixed(0),
                y: +(a[1] * b).toFixed(0),
                width: 20,
                height: 20,
                text: a[4],
                icon: e[a[3]] || null,
                layerType: "fac"
            } : a.length && 4 === a.length && (d = {
                type: "arc",
                x: +(a[0] * b).toFixed(0),
                y: +(a[1] * b).toFixed(0),
                width: null != c ? c.measureText(a[3]).width : 50,
                height: 20,
                text: a[3],
                icon: null,
                layerType: "text"
            }), d
        }
    };
    for (var h in g) b.prototype[h] = g[h];
    a.Draw = b
}(window.IndoorMap), function(global) {
    global.AtlasExportCallback = function() {};
    var Atlas = function(a) {
            var b = this;
            b.options = {
                floorId: null,
                container: null,
                showImage: !0,
                serverHost: "ap.atlasyun.com"
            };
            for (var c in a) b.options[c] = a[c];
            if (!b.options.floorId) return console.error('Param "floorId" lost.');
            if (!b.options.container) return console.error('Param "container" lost.');
            var d = {};
            b.__s = function(a, c) {
                d[a] = b._convertMapData(c)
            }, b.__g = function(a) {
                return d[a]
            }, b.init()
        },
        members = {
            init: function() {
                var a = this;
                if (window.Path2D) a._getFloorData(a.options.floorId, function(b) {
                    b ? a._initDom() : console.log("Something wrong!")
                });
                else {
                    var b = "line-height: {height}px;width:{width}px;height:{height}px;text-align:center;font-size:20px;font-weight:bold;color:#212121;";
                    a.options.container.style.cssText = b.replace(/\{height\}/g, window.innerHeight - 20).replace("{width}", window.innerWidth - 20), a.options.container.innerHTML = "浏览器不支持Canvas新接口Path2D", console.log("浏览器不支持Canvas新接口Path2D"), alert("浏览器不支持Canvas新接口Path2D,请换chrome！")
                }
            },
            exportImage: function() {
                var a = this;
                if (void 0 !== a.__myCanvas || !a.__myCanvas) {
                    var b = a.__myCanvas.toDataURL(),
                        c = function(a, b) {
                            var c = document.createElement("a");
                            c.download = a, c.href = b;
                            var d = document.createEvent("MouseEvents");
                            d.initMouseEvent("click", !0, !1, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), c.dispatchEvent(d)
                        };
                    setTimeout(function() {
                        b && c(a.options.floorId + ".png", b)
                    })
                }
            },
            _initDom: function() {
                var a = this,
                    b = a.__g(a.options.floorId);
                if (!b || null == b) return console.log("no data");
                var c = +(b.mWidth * b.drawScale).toFixed(0),
                    d = +(b.mHeight * b.drawScale).toFixed(0),
                    e = "border:1px dashed #000;line-height: {height}px;width:{width}px;height:{height}px;text-align:center;font-size:20px;font-weight:bold;color:#212121;";
                for (a.options.showImage || (e += "display: none;"), a.options.container.style.cssText = e.replace(/\{height\}/g, d).replace("{width}", c), a.options.container.innerHTML = ""; a.options.container.hasChildNodes();) a.container.removeChild(a.container.firstChild);
                var f = document.createElement("canvas");
                f.height = d, f.width = c, a.options.container.appendChild(f);
                var g = new IndoorMap.Draw;
                g.initDrawData(b);
                var h = f.getContext("2d");
                h.clearRect(0, 0, d, d);
                var i = h.createLinearGradient(0, 0, 170, 0);
                i.addColorStop("0", "#797676"), i.addColorStop("0.5", "#3B3131"), h.strokeStyle = i, h.strokeRect(0, 0, c, d), h.drawImage(g.getBaseMap(), 0, 0, c, d, 0, 0, c, d);
                var j = null;
                null != a.options.fontSize && (j = a.options.fontSize + "px 黑体"), h.drawImage(g.getLayerCanvas(j), 0, 0, c, d, 0, 0, c, d), a.__myCanvas = f, (a.options.callback ||
                    function() {})()
            },
            _getFloorData: function(a, b) {
                var c = this;
                if (c.options.floorData) c.__s(a, c.options.floorData), setTimeout(function() {
                    b(!0)
                });
                else {
                    var d, e = document.createElement("script");
                    d = c.options.apiUrl ? c.options.apiUrl + "?callback=AtlasExportCallback&id=" : "http://" + c.options.serverHost + "/poi/map/floor/getSimple?callback=AtlasExportCallback&id=";
                    var f = d + a;
                    e.setAttribute("src", f), e.onerror = function() {
                        throw alert("请检查网络！"), c.options.netError(), new Error("Ajax failed.")
                    }, document.body.appendChild(e), AtlasExportCallback = function(d) {
                        if ("succeed" == d.result) {
                            var f = JSON.parse(ATLASENCRPY.decrypt("ap.atlasyun.com", d.data));
                            c.__s(a, f);
                            try {
                                document.body.removeChild(e)
                            } catch (g) {}
                            b(!0)
                        } else b(null)
                    }
                }
            },
            _convertMapData: function(data) {
                var self = this,
                    floor = data[6],
                    shopShapes = data[7];
                if (!floor || !shopShapes) throw new Error("Invalid mapdata.");
                for (var arrToObj = function(data, isFloor) {
                    var obj = {},
                        index = 0;
                    if ((null == isFloor || void 0 === isFloor) && (obj.typeId = data[index], ++index), "path" == data[index + 1]) obj.type = "path", obj.d = data[index] || "";
                    else if ("rect" == data[index + 1]) {
                        obj.type = "rect";
                        var attrs = (data[index] || "").split(/\s+/g);
                        attrs.forEach(function(attr) {
                            eval("obj." + attr.trim())
                        }), obj.x = +(obj.x || 0), obj.y = +(obj.y || 0), obj.width = +(obj.width || 0), obj.height = +(obj.height || 0)
                    }
                    if (obj.style = {}, data[index + 2] && /(stroke:[^;]+);?/g.test(data[index + 2]) && (obj.style.stroke = RegExp.$1.split(":")[1].trim()), data[index + 2] && /(fill:[^;]+);?/g.test(data[index + 2]) && (obj.style.fill = RegExp.$1.split(":")[1].trim()), data[index + 2] && /(opacity:[^;]+);?/g.test(data[index + 2]) && (obj.style.opacity = RegExp.$1.split(":")[1].trim()), data[index + 2] && /rotate\((.+)\)/g.test(data[index + 2])) {
                        var rotate = RegExp.$1.split(/\s+|;+|,+/);
                        obj.style.rotate = [Math.floor(+rotate[0]), Math.floor(+rotate[1]) || 0, Math.floor(+rotate[2]) || 0]
                    }
                    return data[index + 2] && /(sid:[^;]+);?/g.test(data[index + 2]) && (obj.sid = RegExp.$1.split(":")[1].trim()), obj
                }, outerFrame = arrToObj(floor, !0), shapes = [], i = 0; i < shopShapes.length; ++i) shapes.push(arrToObj(shopShapes[i]));
                var mapEle = function(a) {
                        var b = {},
                            c = 0,
                            d = 0;
                        if ("path" == a.type) {
                            var e = a.d.split(/[A-Za-z]/g),
                                f = [],
                                g = [];
                            e.forEach(function(a) {
                                var b = a.trim().split(/,+|\s+/g);
                                2 === b.length ? (f.push(+b[0]), g.push(+b[1])) : 6 === b.length && (f.push((+b[0] + +b[2]) / 2), g.push((+b[1] + +b[3]) / 2), f.push(b[4]), g.push(b[5]))
                            });
                            var h = {
                                minX: Math.min.apply(null, f),
                                minY: Math.min.apply(null, g),
                                maxX: Math.max.apply(null, f),
                                maxY: Math.max.apply(null, g)
                            };
                            c = Math.floor(h.minX + h.maxX + 1), d = Math.floor(h.minY + h.maxY + 1)
                        } else "rect" == a.type && (c = Math.floor(2 * a.x + a.width + 1), d = Math.floor(2 * a.y + a.height + 1));
                        return b.x = c / 2, b.y = d / 2, {
                            center: b,
                            width: c,
                            height: d
                        }
                    }(outerFrame),
                    mapOriginWidth = +(mapEle.width + 50).toFixed(6),
                    mapOriginHeight = +(mapEle.height + 5).toFixed(6),
                    drawScale = 1;
                return null == self.options.imgSize || isNaN(self.options.imgSize) || (drawScale = +(self.options.imgSize / Math.max(mapOriginWidth, mapOriginHeight)).toFixed(6)), null != self.options.imgScale && (drawScale = isNaN(+self.options.imgScale) ? 1 : +Math.min(10, Math.max(.01, +self.options.imgScale)).toFixed(6)), {
                    mWidth: mapOriginWidth,
                    mHeight: mapOriginHeight,
                    mCenter: {
                        x: +mapEle.center.x.toFixed(6),
                        y: +mapEle.center.y.toFixed(6)
                    },
                    drawScale: drawScale,
                    showScale: null == self.options.showScale ? !0 : !! self.options.showScale,
                    outerFrame: outerFrame,
                    shapes: shapes,
                    layers: {
                        shops: data[8] || [],
                        fac: data[9] || [],
                        text: data[10] || []
                    }
                }
            }
        };
    for (var key in members) Atlas.prototype[key] = members[key];
    global.AtlasImgExport = Atlas
}(window);