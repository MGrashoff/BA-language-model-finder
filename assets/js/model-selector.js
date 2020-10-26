var modelsJSON = null;
var selectorValues = {
    "started": false,
    "language": "",
    "length": "",
    "data": "",
    "mistakes": "",
    "context": ""
};

$.getJSON("assets/models.json", function (json) {
    modelsJSON = json;
});

$('#language').on('change', function () {
    console.log('Language: ', $(this).val());
    selectorValues.started = true;
    selectorValues.language = $(this).val();
    checkSelectors();
});

$('#length').on('change', function () {
    console.log('Length: ', $(this).val());
    selectorValues.started = true;
    selectorValues.length = $(this).val();
    checkSelectors();
});

$('#data').on('change', function () {
    console.log('Data: ', $(this).val());
    selectorValues.started = true;
    selectorValues.data = $(this).val();
    checkSelectors();
});

$('#mistakes').on('change', function () {
    console.log('Mistakes: ', $(this).val());
    selectorValues.started = true;
    selectorValues.mistakes = $(this).val();
    checkSelectors();
});

$('#context').on('change', function () {
    console.log('Context: ', $(this).val());
    selectorValues.started = true;
    selectorValues.context = $(this).val();
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
        if(selectorValues.started === false ||
            (specs.language == selectorValues.language &&
                (specs.length == selectorValues.length || specs.length <= selectorValues.length) &&
                (specs.data == selectorValues.data || specs.data <= selectorValues.data) &&
                specs.mistakes == selectorValues.mistakes &&
                specs.context == selectorValues.context)) {
            html += '' +
                '<tr>' +
                // '<td><img style="width: 50px;" src="' + modelsJSON[i].image + '" alt=""></td>' +
                '<td>' + modelsJSON[i].name + '</td>' +
                '<td><a href="' + modelsJSON[i].github + '" target="_blank">' + modelsJSON[i].github + '</a></td>' +
                '<td>' + modelsJSON[i].description.substring(0, 120) + '...' + '</td>' +
                '<td><a href="' + modelsJSON[i].download + '" target="_blank">' + modelsJSON[i].download + '</a></td>' +
                '<td><a href="' + modelsJSON[i].paper + '" target="_blank">' + modelsJSON[i].paper + '</a></td>' +
                '<td>' + modelsJSON[i].use + '</td>' +
                '</tr>';
        }

        if (html !== '') {
            $("#table-body").append(html);
        }
    }
}