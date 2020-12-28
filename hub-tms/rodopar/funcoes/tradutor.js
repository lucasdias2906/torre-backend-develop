const dictionaryFull = require('./dictionario.json');

module.exports = async (local, chave, valorPadrao) => {
    try {
        const dictionary = dictionaryFull[local];
        return dictionary[chave] || valorPadrao;
    } catch (error) {
        return valorPadrao;
    }
};
