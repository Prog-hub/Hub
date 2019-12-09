function Result(content, msg, shouldDisplay) {
    this.content = content
    this.message = {text: msg, shouldDisplay: shouldDisplay}
    this.resolve = this.resolve.bind(this)
}

Result.prototype.resolve = function() {

    if (this.content) {return true}
    return false;
}