const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Motag');

const ClientModel = require('../models/client');
