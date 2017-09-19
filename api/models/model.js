/**
 * Created by erikeft on 15/09/17.
 */
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AtivoSchema = new Schema({
    descricao: { type: String, trim: true },
    lote_minimo: Number,
    __v: { type: Number, select: false}
});

var OrdemSchema = new Schema({
    fk_id_ativo: { type: Schema.Types.ObjectId, ref: 'Ativo' },
    quantidade: {
        type: Number,
        required: '',
    },
    preco: {
        type: Number,
        required: '',
    },
    data: { type: Date, default: new Date(), required: '', },
    classe_negociacao: {
        type: String, enum: ['C', 'V'],
        required: '',
    },
    __v: { type: Number, select: false}

});

var models = {
    Ativo: mongoose.model('Ativo', AtivoSchema),
    Ordem: mongoose.model('Ordem', OrdemSchema)
};

module.exports = models;
