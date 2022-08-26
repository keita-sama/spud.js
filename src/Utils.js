function correctType (type, given) {
    return (typeof given === type);
}
module.exports = {
    correctType,
};