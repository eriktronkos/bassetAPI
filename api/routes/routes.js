/**
 * Created by erikeft on 15/09/17.
 */
'use strict';
module.exports = function(app) {
    let controller = require('../controllers/controller');

    /** Ordem */
    app.route('/ordem')
        .get(controller.listar_ordem)
        .post(controller.criar_ordem);

    app.route('/ordem/:data')
        .get(controller.listar_ordem_por_data);

    app.route('/ordem/deletar/:id')
        .delete(controller.deletar_ordem);


    /** Ativo */
    app.route('/ativo')
        .get(controller.listar_ativo)
        .put(controller.update_ativo)
        .post(controller.criar_ativo);

    app.route('/ativo/deletar/:id')
        .delete(controller.deletar_ordem);

    app.route('/ativo/posicao/:ativo')
        .get(controller.posicao_ativo);

};
