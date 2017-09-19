/**
 * Created by erikeft on 15/09/17.
 */
'use strict';
var models = require('../models/model');
var mongoose = require('mongoose');
var Ordem = models.Ordem;
var Ativo = models.Ativo;

exports.listar_ordem = function(req, res) {
    Ordem.find({},null ,{sort: {data: -1}}, function(err, ordens) {
        if (err)
            if (err){
                res.send({ erro: err.message});
                return;
            }
        ordens = ordens.map(function (x) {
            if (x.classe_negociacao == "V"){
                x.quantidade = -Math.abs(x.quantidade);
            }
            return x;
        });
        res.json(ordens);
    });
};

exports.listar_ordem_por_data = function(req, res) {
    try {
        let dataArray = req.params.data.split('-');
        var dataInicio = new Date(Date.UTC(dataArray[0], dataArray[1] - 1, dataArray[2]));
        var dataFim =  new Date(Date.UTC(dataArray[0], dataArray[1] - 1, dataArray[2] +1 ));

        if(!dataInicio || !dataFim)
            throw new Error();

        Ordem.find({data: {"$gte": dataInicio, "$lt": dataFim}},
            null ,
            {sort: {data: -1}},
            function(err, ordens) {
                if (err){
                    res.send({ erro: err.message});
                    return;
                }

            ordens = ordens.map(function (x) {
                if (x.classe_negociacao == "V") {
                    x.quantidade = -Math.abs(x.quantidade);
                }
                return x;
            });
            res.json(ordens);
        });
    }
    catch (e) {
        res.send({ erro: 'Data inválida'});
    }

};

exports.criar_ordem = function(req, res) {
    var ordem = new Ordem(req.body);
    Ativo.findOne({_id: ordem.fk_id_ativo}, null , function (err, atv) {
        if (err){
            res.send({ erro: err.message});
            return;
        }
        if (!atv){
            res.json({ erro: 'Ativo nao encontrado'});
            return;
        }
        if (!((ordem.quantidade % atv.lote_minimo) == 0)){
            res.json({ erro: 'Quantidade nao corresponde a um multiplo do lote minimo'});
            return;
        }

        ordem.save(function(err, ordem) {
            if (err){
                res.send({ erro: err.message});
                return;
            }
            ordem.__v = undefined;
            res.json({ sucesso: ordem });
        });
    });
};

exports.deletar_ordem = function (req, res){
  Ordem.findOneAndRemove({_id: req.params.id}, null , function (err, ordem) {
      if (err){
          res.send({ erro: err.message});
          return;
      }
      res.send({ sucesso: 'Ordem apagada com sucesso' });
  });
};

exports.listar_ativo = function(req, res) {
    Ativo.find({}, function(err, ativos) {
        if (err){
            res.send({ erro: err.message});
            return;
        }

        res.json(ativos);
    });
};

exports.criar_ativo = function(req, res) {
    var ativo = new Ativo(req.body);
    ativo.save(function(err, ativo) {
        if (err){
            res.send({ erro: err.message});
            return;
        }
        res.json({ sucesso: ativo });
    });
};

exports.update_ativo = function(req, res) {
    Ativo.findOneAndUpdate({_id: req.body.ativoId}, req.body, {new: true}, function(err, ativo) {
        if (err){
            res.send({ erro: err.message});
            return;
        }
        res.json({sucesso: ativo });
    });
};

exports.deletar_ativo = function (req, res){
    Ativo.findOneAndRemove({_id: req.params.id}, null , function (err, atv) {
        if (err){
            res.send({ erro: err.message});
            return;
        }
        res.send({ sucesso: 'Ativo apagado com sucesso' });
    });
};

exports.posicao_ativo = function(req, res) {
    Ativo.findOne({descricao: req.params.ativo}, null, function (err, atv) {
        if (err){
            res.send({ erro: err.message});
            return;
        }
        if (!atv){
            res.send({ erro: 'Ativo não encontrado'});
        }
        Ordem.find({fk_id_ativo: atv._id}, function(err, ordem) {
        if (err)
            res.send({erro: err.message});
            var posicao = 0;
            ordem.forEach(function (currentValue) {
                if (currentValue.classe_negociacao == 'C') {
                    posicao += currentValue.quantidade;
                }
                else {
                    posicao -= currentValue.quantidade;
                }
            });
            res.json({ativo: atv, posicao: posicao});
        });
    });
};

exports.delete_a_task = function(req, res) {

    Task.remove({
        _id: req.params.taskId
    }, function(err, task) {
        if (err){
            res.send({ erro: err.message});
            return;
        }
        res.json({ message: 'Task successfully deleted' });
    });
};



