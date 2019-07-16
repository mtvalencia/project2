// Get references to page elements

var $submitBtn = $("#submit");
var $exampleList = $("#example-list");
var entryForm = $("#entryForm");
var startRaffleBtn = $('#startRaffleBtn');

// The API object contains methods for each kind of request we'll make
var API = {
  createEntry: function (entry) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/games/" + entry.gameId + "/enter",
      data: JSON.stringify(entry)
    });
  },
  finishGame: function (gameId) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/games/" + entry.gameId + "/enter",
      data: JSON.stringify(entry)
    });
  },
  saveExample: function (example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/games",
      data: JSON.stringify(example)
    });
  },
  getExamples: function () {
    return $.ajax({
      url: "/api/games",
      type: "GET"
    });
  },
  deleteExample: function (id) {
    return $.ajax({
      url: "/api/games/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
  API.getExamples().then(function (data) {
    var $examples = data.map(function (example) {
      var $a = $("<a>")
        .text(example.name)
        .attr("href", "/games/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
  event.preventDefault();
  // console.log("EXAMPLE NAME:", $("#example-name").val(), "EXAMPLE ENTRIES:",$("#example-entries").val(), "EXAMPLE LINK:",$("#example-link").val())
  var example = {
    name: $("#example-name").val().trim(),
    // entries: $("#example-entries").val().trim(),
    // link: $("#example-link").val().trim(),
  };

  if (!(example.name)) {
    alert("You must enter a prize");
    return;
  }

  API.saveExample(example).then(function () {
    refreshExamples();
  });

  $("#example-name").val("");
  // $("#example-entries").val("");
  // $("#example-link").val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");
  API.deleteExample(idToDelete).then(function () {
    refreshExamples();
  });
};

var handleSubmitEntry = function(entryFormSubmitEvent) {
  $(".alert").hide();
  API.createEntry({
    gameId: $("input[name='gameId']", entryFormSubmitEvent.target).val(),
    name: $("#name", entryFormSubmitEvent.target).val().trim(),
    points: $("#points", entryFormSubmitEvent.target).val().trim(),
    avatar: $("input[name='avatar-id']").val()
  })
  .then(function () {
    console.log("saved entry");
    $(".alert-success").show();
    window.location.reload(false);
  })
  .catch(function (error) {
    $(".alert-danger").show();
    console.log("Failed saving entry");
  });
  entryFormSubmitEvent.preventDefault();
}

var handleClickStart = function(clickStartEvent) {
  if (!confirm('Are you sure you want to finish this game and pick a winner?')) {
    return;
  }
  clickStartEvent.preventDefault();
}

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
entryForm.on("submit", handleSubmitEntry);
startRaffleBtn.on('click', handleClickStart);

$(".dropdown-menu .dropdown-item").on("click", function (event) {
  event.preventDefault();
  $("#selectedAvatar > img").attr("src", $("img", event.target).first().attr("src"));
  $("#selectedAvatar").show();
  $("input[name='avatar-id']").val($(event.target).data("image-id"));
})