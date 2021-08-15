//func that sets up pokemon list
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  //functions to add and and receive pokemon.
  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let pagelist = document.querySelector(".pokemon-page-list");
    let listItem = document.createElement("li");
    let button = document.createElement("button");
    let idname = pokemon.name;
    button.innerText = pokemon.name;
    $(button).addClass("button2class btn btn-info btn-lg");
    $(listItem).addClass("list-group-item");
    $(listItem).attr("id", idname);
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#pokemonModal");
    button.dataset.target = "#pokemon-modal";
    listItem.appendChild(button);
    pagelist.appendChild(listItem);

    buttonListener(button, pokemon);
  }

  //add button press functionality, refers to showDetails
  function buttonListener(button, pokemon) {
    button.addEventListener("click", function (event) {
      showDetails(pokemon);
    });
  }

  // show details, refers to show modal.
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

  //loads 150 pokemon api. stuff for loading info
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        hideLoadingMessage();
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        hideLoadingMessage();
        console.error(e);
      });
  }

  //loads specefic individual pokemon data
  function loadDetails(item) {
    showLoadingMessage();
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        hideLoadingMessage();
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.id = details.id;
        item.type1 = details.types[0].type.name;
        try {
          item.type2 = details.types[1].type.name;
        } catch (error) {
          console.error(error);
        }
      })
      .catch(function (e) {
        hideLoadingMessage();
        console.error(e);
      });
  }

  //stuff for loading... icon
  function showLoadingMessage(pokemon) {
    loadingMessage = document.querySelector("#loadring");
    let isHidden = loadingMessage.classList.contains("hidden");
    if (isHidden) {
      loadingMessage.classList.remove("hidden");
    }
  }

  function hideLoadingMessage() {
    loadingMessage = document.querySelector("#loadring");
    let isHidden = loadingMessage.classList.contains("hidden");
    if (!isHidden) {
      $(loadingMessage).addClass("hidden");
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //show modal
  function showModal(pokemon) {
    let modal = $(".modal");
    let modalTitle = $(".modal-title");
    let modalBody = $(".modal-body");

    modalBody.empty();
    modalTitle.empty();

    let titleElement = document.createElement("h1");
    titleElement.innerText = pokemon.name;
    $(titleElement).addClass("modal-pokeTitle");

    let pokePic = document.createElement("div");
    pokePic.innerHTML = "<img src = '" + pokemon.imageUrl + "' />";
    $(pokePic).addClass("modal-pokePic");

    let pokeId = document.createElement("p");
    pokeId.innerText = "id: " + pokemon.id;
    $(pokeId).addClass("modal-pokeId");

    let pokeHeight = document.createElement("p");
    pokeHeight.innerText = "height: " + pokemon.height;
    $(pokeHeight).addClass("modal-pokeHeight");

    //handels possibility for two types
    let pokeType = document.createElement("p");
    if (pokemon.type2) {
      pokeType.innerText = "type: " + pokemon.type1 + ", " + pokemon.type2;
    } else {
      pokeType.innerText = "type: " + pokemon.type1;
    }
    $(pokeType).addClass("modal-pokeType");

    //arrow buttons
    let arrowright = document.createElement("button");
    $(arrowright).addClass("modal-arrowright btn");
    arrowright.innerText = "next";
    arrowright.addEventListener("click", () => {
      pokePosition = pokemon.id;
      if (pokePosition === 150) {
        pokePosition = 0;
      }
      modalBody.empty();
      modalTitle.empty();
      showDetails(pokemonList[pokePosition]);
    });

    let arrowleft = document.createElement("button");
    $(arrowleft).addClass("modal-arrowleft btn");
    arrowleft.innerText = "previous";
    arrowleft.addEventListener("click", () => {
      pokePosition = pokemon.id - 2;
      if (pokePosition < 0) {
        pokePosition = 149;
      }
      modalBody.empty();
      modalTitle.empty();
      console.log(pokePosition);
      showDetails(pokemonList[pokePosition]);
    });

    let arrowdiv = document.createElement("div");
    $(arrowdiv).addClass("modal-arrowdiv");

    let arrowdivright = document.createElement("span");
    $(arrowdivright).addClass("modal-arrow-div-right");

    let arrowdivleft = document.createElement("span");
    $(arrowdivleft).addClass("modal-arrow-div-left");

    modalTitle.append(titleElement);

    modalBody.append(pokePic);

    modalBody.append(arrowdiv);
    arrowdivleft.append(arrowleft);
    arrowdivright.append(arrowright);
    arrowdiv.append(arrowdivright);
    arrowdiv.append(arrowdivleft);

    modalBody.append(pokeId);
    modalBody.append(pokeHeight);
    modalBody.append(pokeType);

    modalContainer.append(modal);
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    showDetails: showDetails,
    buttonListener: buttonListener,
    loadList: loadList,
    loadDetails: loadDetails,
    showLoadingMessage: showLoadingMessage,
    hideLoadingMessage: hideLoadingMessage,
    showModal: showModal,
  };
})();

pokemonRepository.loadList().then(function () {
  //now the data is loaded
  pokemonRepository.getAll().forEach(pokemonRepository.addListItem);
  //now the data is added to our HTML as list items and buttons
});

//right out of the gate we have loadlist (which takes 150 pokemon and adds them to list)
//and we have addListItem which puts them all as list items and buttons to be clicked on.

//THEN when clicking the button we take the individual pokemon URL, and get a picture, height,
//and type details and throws them into the console log.

