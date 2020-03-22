const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Motag');

const Mappings = require('../models/proxyToClient');

Mappings.updateMany({}, { client: [] });
