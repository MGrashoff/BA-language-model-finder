var modelsJSON = null;
var selectorValues = {
    "started": false,
    "languages": "",
    "length": "",
    "use": "",
    "mistakes": "",
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

$('#length').on('change', function () {
    console.log('Length: ', $(this).val());
    selectorValues.started = true;
    selectorValues.length = $(this).val();
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

$('#mistakes').on('change', function () {
    console.log('Mistakes: ', $(this).val());
    selectorValues.started = true;
    selectorValues.mistakes = $(this).val();
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
    if(selectorValues.language !== "" &&
        selectorValues.length !== "" &&
        selectorValues.data !== "" &&
        selectorValues.mistakes !== "" &&
        selectorValues.context !== "") {
        $('#search').removeClass('disabled');
    }
}

function fillTable() {
    console.log(selectorValues);
    $('#table-body').empty();

    for (var i = 0; i < modelsJSON.length; i++) {
        var html = '';
        var specs = modelsJSON[i].specs;
        var use = modelsJSON[i].use;
        var languages = modelsJSON[i].languages;
        var check = checkLanguage(languages);
        var language = check[0];
        var iterator = check[1];

        if(selectorValues.started === false ||
            ((specs.length == selectorValues.length || specs.length >= selectorValues.length) &&
                specs.mistakes == selectorValues.mistakes &&
                specs.context == selectorValues.context) &&
            checkUse(use) && check !== false) {

            html += '' +
                '<tr>' +
                '<td style="width: 90px; max-width: 90px;">' + modelsJSON[i].name + '-' + language + '</td>' +
                '<td style="width: 110px; max-width: 110px;"><a href="' + modelsJSON[i].github + '" target="_blank">' + modelsJSON[i].github + '</a></td>' +
                '<td style="width: 250px; max-width: 250px;">' + modelsJSON[i].description + '</td>' +
                '<td style="width: 110px; max-width: 110px;"><a href="' + modelsJSON[i].languages[iterator][language] + '" target="_blank">' + modelsJSON[i].languages[iterator][language] + '</a></td>' +
                '<td><a href="' + modelsJSON[i].paper + '" target="_blank">' + modelsJSON[i].paper + '</a></td>' +
                '</tr>';
        }

        if(html !== '') {
            $("#table-body").append(html);
        }
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