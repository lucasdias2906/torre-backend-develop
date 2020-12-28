module.exports = {
    retornarTotalPaginas(totalRegistros, totalPorPagina) {
        if (totalPorPagina === 0) return 1;

        let totalPaginas = Math.trunc(totalRegistros / totalPorPagina);
        if (totalRegistros % totalPorPagina !== 0) {
            // eslint-disable-next-line no-plusplus
            totalPaginas++;
        }
        return totalPaginas;
    },

    returnarOrdem(camposInformados, camposValidos) {
        const ordem = [];
        const invalido = [];
        const itens = camposInformados.split(',');
        const valid = camposValidos;

        itens.forEach(item => {
            const asc = item.indexOf('-') !== 0;
            const found = valid.find(element => {
                return element === item.trim();
            });
            if (!found) {
                invalido.push(`invalido campo: ${item}`);
            } else {
                ordem.push([
                    asc ? item : item.substring(1, item.length),
                    asc ? 'ASC' : 'DESC',
                ]);
            }
        });

        return {
            ok: invalido.length === 0,
            ordem,
            mensagem: invalido,
        };
    },
};
