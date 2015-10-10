var _S = require('underscore.string');
var _ = require('underscore');
var stringXtras = require('../string-xtras');

function Content(data) {
    this.type = '';

    this.title = '';
    this.description = '';
    this.body = '';
    this.created_at = new Date();
    this.updated_at = new Date();
    this.publish = true;
    this.publish_on = new Date();
    this.publish_off = null;
    this.children = [];
    this.parent = null;
    this.extras = [];

    _.extend(this, data);
    this.slug = this.slug || _S.slugify(this.title);
    this.typePlural = this.typePlural || stringXtras.pluralize(this.type);
    this.order = this.order || 0;

    // console.log(this);
}

Content.prototype.fullSlug = function() {
    return (this.parent && this.parent.fullSlug ? this.parent.fullSlug() + '/' + this.slug : this.slug);
};

module.exports = Content;
