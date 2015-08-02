'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	address: {
		type: String
	},
	city: {
		type: String
	},
	apt_number: {
		type: String
	},
	borough: {
		type: String
	},
	state: {
		type: String
	},
	zipcode: {
		type: String
	},
	neighborhood: {
		type: String
	},
	cross_street_1: {
		type: String
	},
	cross_street_2: {
		type: String
	},
	ownership: {
		type: String
	},
	service_level: {
		type: String
	},
	building_type: {
		type: String
	},
	building_access: {
		type: String
	},
	building_age: {
		type: String
	},
	laundry_room: {
		type: String
	},
	floor_count: {
		type: String
	},
	apartment_count: {
		type: String
	},
	year_built: {
		type: String
	},
	block: {
		type: String
	},
	lot: {
		type: String
	},
	sale_terms: {
		price: Number,
	},
	details: {
    	listing_id: Number,
    	sale_or_rent:  String,
    	apartment_size: String,
    	num_rooms: Number,
    	num_bedrooms: Number,
    	num_baths: Number,
    	approx_square_footage: Number,
    	status: String,
    	listing_type: String,
    	date_listed: Date,
    	date_available: Date,
    	date_modified: Date,
    	pet_policy: String
  },
  apartment_features: {
    	washer_dryer: String,
    	walk_in_closet:  String,
    	dishwasher: String,
    	oversized_windows: String,
    	agent: {
    		first_name: String,
    		last_name: String,
    		title: String,
    		work_phone: Number,
    		mobile_phone: Number,
    		email: String,
    		fax: Number,
    		company_name: String
    	},
    	photos: {
    		media:[
    			{
    				media_url: String
    			},
    		],
    	},
  },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

var NeighborhoodSchema = new Schema({});



mongoose.model('Article', ArticleSchema);

mongoose.model('Neighborhood', NeighborhoodSchema);