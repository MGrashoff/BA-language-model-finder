var modelsJSON = null;
var selectorValues = {
    "started": false,
    "languages": "",
    "use": "",
    "textTypes": "",
    "context": ""
};

$.getJSON("assets/models.json", function (json) {
    modelsJSON = json;
    if(localStorage.getItem("selectorValues") !== null) {
        selectorValues = JSON.parse(localStorage.getItem("selectorValues"));
        checkSelectors();
    }
});

$('#language').on('change', function () {
    console.log('Languages: ', $(this).val());
    selectorValues.started = true;
    selectorValues.languages = $(this).val();
    localStorage.setItem('selectorValues', JSON.stringify(selectorValues));
    checkSelectors();
});

$('#use').on('change', function () {
    console.log('Use: ', $(this).val());
    selectorValues.started = true;
    selectorValues.use = $(this).val();
    localStorage.setItem('selectorValues', JSON.stringify(selectorValues));
    checkSelectors();
});

$('#text-type').on('change', function () {
    console.log('Text-Type: ', $(this).val());
    selectorValues.started = true;
    selectorValues.textTypes = $(this).val();
    localStorage.setItem('selectorValues', JSON.stringify(selectorValues));
    checkSelectors();
});

$('#context').on('change', function () {
    console.log('Context: ', $(this).val());
    selectorValues.started = true;
    selectorValues.context = $(this).val();
    localStorage.setItem('selectorValues', JSON.stringify(selectorValues));
    checkSelectors();
});

$('#search').on('click', function () {
    $('#table-container').removeClass('hide');
    fillTable();
});

function checkSelectors() {
    if(selectorValues.languages !== "" &&
        selectorValues.textTypes !== "" &&
        selectorValues.use !== "" &&
        selectorValues.context !== "") {
        $('#search').removeClass('disabled');
    }
}

function fillTable() {
    console.log(selectorValues);
    $('#table-body').empty();
    var lmFound = false;

    for (var i = 0; i < modelsJSON.length; i++) {
        var html = '';
        var specs = modelsJSON[i];
        var use = specs.use;
        var textTypes = specs.textTypes;
        var languages = specs.languages;
        var check = checkLanguage(languages);
        var language = check[0];
        var iterator = check[1];

        if(selectorValues.started === false ||
            (specs.context == selectorValues.context) &&
            checkUse(use) && check !== false && checkTextTypes(textTypes)) {
            lmFound = true;

            html += '' +
                '<tr>' +
                '<td style="width: 90px; max-width: 90px;">' + modelsJSON[i].name + '-' + language + '</td>' +
                '<td style="width: 110px; max-width: 110px;"><a href="' + modelsJSON[i].github + '" target="_blank">' + modelsJSON[i].github + '</a></td>' +
                '<td style="width: 250px; max-width: 250px;">' + modelsJSON[i].description + '</td>' +
                '<td style="width: 110px; max-width: 110px;"><a href="' + modelsJSON[i].languages[iterator][language] + '" target="_blank">' + modelsJSON[i].languages[iterator][language] + '</a></td>' +
                '<td><a href="' + modelsJSON[i].paper + '" target="_blank">' + modelsJSON[i].paper + '</a></td>' +
                '</tr>';
        }

        if (html !== '') {
            $("#table-body").append(html);
        }
    }

    if (!lmFound) {
        $("#table-body").append('<tr><td><p>Keine Ergebnisse gefunden</p></td></tr>');
    }
}

function checkUse(modelUseCases) {
    for (var i = 0; i < selectorValues.use.length; i++) {
        if (!modelUseCases.includes(selectorValues.use[i])) {
            return false;
        }
    }
    return true;
}

function checkTextTypes(modelTextType) {
    for (var i = 0; i < selectorValues.textTypes.length; i++) {
        if (!modelTextType.includes(selectorValues.textTypes[i])) {
            return false;
        }
    }
    return true;
}

function checkLanguage(modelLanguages) {
    if (selectorValues.languages.length > 1) {
        for (var i = 0; i < modelLanguages.length; i++) {
            for (var language in modelLanguages[i]) {
                if (language === 'multi') {
                    return ['multi', i];
                }
            }
        }
        return false;
    } else {
        for (var j = 0; j < modelLanguages.length; j++) {
            for (var l in modelLanguages[j]) {
                if (selectorValues.languages.includes(l)) {
                    return [l, j];
                }
            }
        }
        return false;
    }
}