module.exports = {

    // a CREATE action
    create: function(req, res, next) {

        var params = req.params.all();

        Proceedings.create(params, function(err, proceeding) {

            if (err) return next(err);

            res.status(201);

            res.json(proceeding);

        });

    },

    // a FIND action
    find: function(req, res, next) {

        var id = req.param('id');

        var idShortCut = isShortcut(id);

        if (idShortCut === true) {
            return next();
        }

        if (id) {

            Proceedings.findOne(id, function(err, proceeding) {

                if (proceeding === undefined) return res.notFound();

                if (err) return next(err);

                res.json(proceeding);

            });

        } else {

            var where = req.param('where');

            if (_.isString(where)) {
                where = JSON.parse(where);
            }

            var options = {
                limit: req.param('limit') || undefined,
                skip: req.param('skip') || undefined,
                sort: req.param('sort') || undefined,
                where: where || undefined
            };

            Proceedings.find(options, function(err, proceeding) {

                if (proceeding === undefined) return res.notFound();

                if (err) return next(err);

                res.json(proceeding);

            });

        }

        function isShortcut(id) {
            if (id === 'find' || id === 'update' || id === 'create' || id === 'destroy') {
                return true;
            }
        }
    }
};
