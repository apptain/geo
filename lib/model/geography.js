var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Country = new Schema({
    Name: { type: String, required: true },
    CountryCode: { type: String },
    TwoCharISOCode: { type: String },
    ThreeCharISOCode: { type: String }
});

Country.index({ Name: 1, unique: true });

mongoose.model('Country', Country);

var StateProvince = new Schema({
    Country: { type: Schema.ObjectId, ref: 'Country', required: true },
    Name: { type: String, required: true },
    Category: { type: String },
    Abbreviation: { type: String, required: true }
});

StateProvince.index({ Country: 1, Name: 1 }, { unique: true });

mongoose.model('StateProvince', StateProvince);


