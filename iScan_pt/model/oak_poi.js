var mongo = require('mongoose');
var Schema = mongo.Schema;
var ObjectId = Schema.ObjectId;

var poiSchema = new Schema({
    poi_type: String,
    ch_name:  String,
    en_name:  String,
    displayName: String,
    alias:String,
    open:     String,
    city_id:  Schema.ObjectId,
    district_id: Schema.ObjectId,
    addr:     String,
    floor: String,
    phone:    String,
    m_policy: String,
    website:  String,
    emal:     String,
    desc:     String,
    baseImg: String,
    photoes:  [],
    logo:     {
        domain: String,
        key  : String,
        hash : String
    },
    sns:      String,
    lon:      Number,
    lat:      Number,
    traffic:  String,
    prods:    [],
    prodId: Number,
    poi_type_id: Schema.ObjectId,
    brand_id: Schema.ObjectId,
    last_updated: {type: Date, default: Date.now},
    outdoor_view_pic: [],
    indoor_view_pic: [],
    guide_map_pic:[],
    extinguishing_map_pic: [],
    shop_dianping_id: String,
    disable : {type:Boolean,default:true},
    deleted : {type:Boolean,default:false},
    paths:{},
    fences: {},
    ownerId: {type:ObjectId,default:null}
}, {versionKey: false});

poiSchema.set('collection', 'poi_editor');
module.exports = poiSchema;