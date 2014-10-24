rewriter = (req, res, next) ->
    req.app.routes?.get?.forEach (item)->
        if item.match req.url
            item.callbacks.forEach (callback) ->
                if callback and callback.rewriteTarget
                    req.urlRewritten = req.url
                    req.url = req.url.replace(
                        item.regexp
                        callback.rewriteTarget
                    )
                    console.log "Rewrote #{req.urlRewritten} to #{req.url}"
                return

            return

    next()
    return

rewriter.rewrite = (target) ->
    handler = (req, res, next) ->
        # This route should never ever be handler because it will be
        # intercepted by the rewriter middleware before it gets here. If this
        # ever gets called, it means you forgot to use the rewriter middleware.
        res.status(500).end()
        return

    handler.rewriteTarget = target
    handler

module.exports = rewriter
