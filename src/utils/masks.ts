function maskCep(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d{3})+?$/, "$1-$2")
    return value;
}

function maskCpf(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    return value;
}

function maskCnpj(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    return value;
}

function maskPhone(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    return value;
}

function maskCurrency(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1,$2");
    value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
    return value;
}

function maskPrice(value: string) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d)(\d{2})$/, "$1.$2");
    return value;
}

function maskDate(value: string) {
    // Remove todos os caracteres que não são números
    value = value.replace(/\D/g, '');

    // Aplica a máscara de data (dd/mm/yyyy)
    value = value.replace(/(\d{2})(\d)/, '$1-$2'); // Insere a primeira barra
    value = value.replace(/(\d{2})(\d)/, '$1-$2'); // Insere a segunda barra

    // Limita a data ao formato dd/mm/yyyy
    value = value.replace(/(\d{2})\/(\d{2})\/(\d{4}).*/, '$1-$2-$3');

    return value;
}

export { maskCep, maskCpf, maskCnpj, maskPhone, maskCurrency, maskPrice, maskDate }