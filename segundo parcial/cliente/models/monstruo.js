import { Personaje } from "./personaje.js";

class Monstruo extends Personaje {
  constructor(id, nombre, tipo, alias, defensa, miedo, armas) {
    super(id, nombre, tipo);
    this.alias = alias;
    this.defensa = defensa;
    this.miedo = miedo;
    this.armas = armas;
  }
}

const getMonstruos = async () =>{
  mostrarSpinner();
  try {
    const res = await fetch('http://localhost:3000/monstruos');
    if (!res.ok) throw res;
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Error ${res.status}: ${res.statusText}`);
  }
  finally {
    ocultarSpinner();
  }
}

const getMonstruoPorId = async (id) =>{
  mostrarSpinner();

  // const xhr = new XMLHttpRequest();

  // xhr.onreadystatechange = () => {
  //   if(xhr.readyState == 4){
  //     if(xhr.status >= 200 && xhr.status < 300){
  //       const data = JSON.parse(xhr.responseText);
  //       console.log(data);
  //       return data;
  //     }
  //   }
  //   ocultarSpinner();
  // }

  // xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");

  // xhr.open("GET", `http://localhost:3000/monstruos/${id}`, true);

  // xhr.send();

  try {
    const res = await fetch(`http://localhost:3000/monstruos/${id}`);
    if (!res.ok) throw res;
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Error ${res.status}: ${res.statusText}`);
  }
  finally {
    ocultarSpinner();
  }
}

function mostrarAlerta(mensaje) {
  const alerta = document.createElement("div");
  alerta.textContent = mensaje;

  const contenedor = document.getElementById("alerta");
  contenedor.appendChild(alerta);

  setTimeout(() => {
    alerta.style.opacity = "0";
    setTimeout(() => {
      contenedor.removeChild(alerta);
    }, 500);
  }, 3000);
}

const tipos = ["vampiro", "zombie", "esqueleto", "fantasma", "bruja", "hombre lobo"];
const selectTipo = document.getElementById("frmTipo");

tipos.forEach((tipo) => {
  const opcion = document.createElement("option");
  opcion.value = tipo;
  opcion.text = tipo;
  selectTipo.add(opcion);
});

const selectTipoFiltrado = document.getElementById("tipoFiltrado");
const opcionTodos = document.createElement("option");
opcionTodos.value = "todos";
opcionTodos.text = "todos";
selectTipoFiltrado.add(opcionTodos);

tipos.forEach((tipo) => {
  const opcion = document.createElement("option");
  opcion.value = tipo;
  opcion.text = tipo;
  selectTipoFiltrado.add(opcion);
});

const mostrarSpinner = () => {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";
};

const ocultarSpinner = () => {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "none";
};

const mostrarSpinnerCard = () => {
  const spinner = document.getElementById("spinnerCard");
  spinner.style.display = "block";
};

const ocultarSpinnerCard = () => {
  const spinner = document.getElementById("spinnerCard");
  spinner.style.display = "none";
};

const setUpEventos = () => {
  const btnEditar = document.querySelectorAll(".btnEditar");

  btnEditar.forEach((btnEditar) => {
    btnEditar.addEventListener("click", async (e) => {
      e.preventDefault();

      document.getElementById("btnSubmitEditar").style.visibility = "visible";
      document.getElementById("btnSubmitGuardar").style.visibility = "hidden";

      const monstruoId = e.target.dataset.monstruoId;
      
      let monstruo = await getMonstruoPorId(monstruoId);

      document.querySelector("#frmNombre").value = monstruo.nombre;
      document.querySelector("#frmTipo").value = monstruo.tipo;
      document.querySelector("#frmAlias").value = monstruo.alias;
      document.querySelector("#frmMiedo").value = monstruo.miedo;
      const defensa = document.querySelectorAll('input[name="frmDefensa"]');

      defensa.forEach((radio) => {
        if (radio.value == monstruo.defensa) {
          radio.checked = true;
        } else {
          radio.checked = false;
        }
      });

      const armasInput = document.querySelectorAll('input[name="armas"]');

      monstruo.armas.forEach((arma) => {
        const armasInputAux = Array.from(armasInput);
        const checkbox = armasInputAux.find((input) => input.value == arma);
        if (checkbox) {
          checkbox.checked = true;
        }
      });

      const btnSubmitEditar = document.getElementById("btnSubmitEditar");
      btnSubmitEditar.dataset.monstruoId = monstruo.id;
    });
  });

  const btnEliminar = document.querySelectorAll(".btnEliminar");

  btnEliminar.forEach((btnEliminar) => {
    btnEliminar.addEventListener("click", (e) => {
      mostrarSpinner();
      e.preventDefault();
      const monstruoId = e.target.dataset.monstruoId;

      fetch(`http://localhost:3000/monstruos/${monstruoId}`, {
        method: "DELETE"
      })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => console.log(data))
      .catch((res) => console.error(`Error ${res.status}: ${res.statusText}`))
      .finally(() => {
        ocultarSpinner();
        crearTabla();
        mostrarAlerta("Se Elimino correctamente");
      });
    });
  });

  // axios
  //     .delete(`http://localhost:3000/monstruos/${monstruoId}`)
  //     .finally(() => {
  //       ocultarSpinner();
  //       crearTabla();
  //       mostrarAlerta("Se Elimino correctamente");
  //     });

};

const eventoFiltrado = document.getElementById('tipoFiltrado');

eventoFiltrado.addEventListener('change', async (e)=> {
  let tipoSelect = eventoFiltrado.value;
  let monstruos = await getMonstruos();

  let monstruosFiltrados;

  if (tipoSelect != 'todos') {
    monstruosFiltrados = monstruos.filter(mons => mons.tipo == tipoSelect);
  }else{
    monstruosFiltrados = monstruos;
  }

  crearTabla(monstruosFiltrados);
});

const eventoAtributos = document.getElementById('mapAtributos').addEventListener('change', async (e) => {
  if (e.target.type === 'checkbox') {
      let monstruos = await getMonstruos();
      const atributos = Array.from(
        document.querySelectorAll('input[name="atributos"]:checked')
      ).map((input) => input.value);

      const listaMap = monstruos.map((monstruo) => {
        const nuevoMonstruo = {
          id: monstruo.id
        };
        atributos.forEach((atributo) => {
          nuevoMonstruo[atributo] = monstruo[atributo];
        });
        return nuevoMonstruo;
      });
      crearTabla(listaMap);
  }
});

function primerLetraMayuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function crearTableHead(monstruo){
  let thead = document.createElement('thead');
  let tr = document.createElement('tr');

  for (const key in monstruo) {
    if (key != 'id') {
      let th = document.createElement('th');
      let texto = document.createTextNode(primerLetraMayuscula(key));
      th.appendChild(texto);
      tr.appendChild(th);
    }
  }

  const thEditar = document.createElement('th');
  let texto = document.createTextNode('Editar');
  thEditar.appendChild(texto);
  tr.appendChild(thEditar);

  const thEliminar = document.createElement('th');
  let textoEliminar = document.createTextNode('Eliminar');
  thEliminar.appendChild(textoEliminar);
  tr.appendChild(thEliminar);

  thead.appendChild(tr);

  return thead;
}

function crearTableBody(lista){
  let tbody = document.createElement('tbody');
  lista.forEach(monstruo => {
    let tr = document.createElement('tr');
    for (const key in monstruo) {
      if (key != 'id') {
        let td = document.createElement('td');
        let texto = document.createTextNode(monstruo[key]);
        td.appendChild(texto);
        td.id = `td${primerLetraMayuscula(key)}`;
        tr.appendChild(td);
      }
    }
    const tdEditar = document.createElement("td");
    tdEditar.id = "tdEditar";
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.id = "btnEditar";
    btnEditar.classList.add("btnEditar");
    btnEditar.dataset.monstruoId = monstruo.id;
    tdEditar.appendChild(btnEditar);
    tr.appendChild(tdEditar);

    const tdEliminar = document.createElement("td");
    tdEliminar.id = "tdEliminar";
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.id = "btnEliminar";
    btnEliminar.classList.add("btnEliminar");
    btnEliminar.dataset.monstruoId = monstruo.id;
    tdEliminar.appendChild(btnEliminar);
    tr.appendChild(tdEliminar);

    tbody.appendChild(tr);
  });
  return tbody;
}

function refrescarDiv(div, tabla){
  while(div.hasChildNodes()){
    div.removeChild(div.firstElementChild);
  }
  div.appendChild(tabla);
}

const mostarPromedio = async (lista) =>{
  let monstruosOriginal = await getMonstruos();
  let monstruos = monstruosOriginal.filter(mons => {
    return lista.some(mapeado => mapeado.id === mons.id);
  });

  const suma = monstruos.reduce((suma, monstruo) => suma + monstruo.miedo, 0);
  const promedio = suma / monstruos.length;

  const input = document.getElementById('promedioMiedo');
  input.value = promedio.toFixed(2);
}

const ordenarPorMiedo = async (lista) =>{
  let monstruosOriginal = await getMonstruos();
  let monstruos = monstruosOriginal.filter(mons => {
    return lista.some(mapeado => mapeado.id === mons.id);
  });
  let monstruosOrdenados = monstruos.sort((mons1,mons2 ) => mons2.miedo - mons1.miedo);
  console.log(monstruosOrdenados);
  return monstruosOrdenados;
}

async function crearTabla(lista){
  let monstruos;
  if (!lista) {
    monstruos = await getMonstruos();
  }else{
    monstruos = lista;
  }

  mostarPromedio(monstruos);

  monstruos = await ordenarPorMiedo(monstruos);

  let tabla = document.createElement('table');
  tabla.appendChild(crearTableHead(monstruos[0]));
  tabla.appendChild(crearTableBody(monstruos));
  tabla.id = 'tablaMonstruos';

  const divTabla = document.getElementById('divTabla');
  refrescarDiv(divTabla, tabla);
  
  setUpEventos();
}

crearTabla();

const crearCards = async  () => {
  mostrarSpinnerCard();
  const monstruos = await getMonstruos();
  ocultarSpinnerCard();
  const sectionCards = document.getElementById("cardsMonstruos");

  sectionCards.innerHTML = "";

  let titulo = document.createElement("h1");
  titulo.textContent = "Informacion Monstruos:";
  titulo.id = "tituloCards";
  sectionCards.appendChild(titulo);

  monstruos.forEach((monstruo) => {
    let articleCard = document.createElement("article");
    articleCard.id = "card";

    let divNombre = document.createElement("div");
    divNombre.id = "iconosCards";
    let nombre = document.createElement("p");
    nombre.textContent = monstruo.nombre;
    divNombre.appendChild(nombre);

    let divAlias = document.createElement("div");
    divAlias.id = "iconosCards";
    let alias = document.createElement("p");
    alias.textContent = monstruo.alias;
    let imgAlias = document.createElement("img");
    imgAlias.src = "./asserts/alias.png";
    divAlias.appendChild(imgAlias);
    divAlias.appendChild(alias);

    let divTipo = document.createElement("div");
    divTipo.id = "iconosCards";
    let tipo = document.createElement("p");
    tipo.textContent = monstruo.tipo;
    let imgTipo = document.createElement("img");
    imgTipo.src = "./asserts/fantasma.png";
    divTipo.appendChild(imgTipo);
    divTipo.appendChild(tipo);

    let divDefensa = document.createElement("div");
    divDefensa.id = "iconosCards";
    let defensa = document.createElement("p");
    defensa.textContent = monstruo.defensa;
    let imgDefensa = document.createElement("img");
    imgDefensa.src = "./asserts/defensa.png";
    divDefensa.appendChild(imgDefensa);
    divDefensa.appendChild(defensa);

    let divMiedo = document.createElement("div");
    divMiedo.id = "iconosCards";
    let miedo = document.createElement("p");
    miedo.textContent = monstruo.miedo;
    let imgMiedo = document.createElement("img");
    imgMiedo.src = "./asserts/miedo.png";
    divMiedo.appendChild(imgMiedo);
    divMiedo.appendChild(miedo);

    let divArmas = document.createElement("div");
    // divArmas.id = "iconosCards";
    let armas = document.createElement("p");
    armas.textContent = monstruo.armas.join(' ');
    divArmas.appendChild(armas);

    articleCard.appendChild(divNombre);
    articleCard.appendChild(divAlias);
    articleCard.appendChild(divTipo);
    articleCard.appendChild(divDefensa);
    articleCard.appendChild(divMiedo);
    articleCard.appendChild(divArmas);
    sectionCards.appendChild(articleCard);
  });
};

const guardarMonstruo = (
  nombreAux,
  tipoAux,
  aliasAux,
  defensaAux,
  miedoAux,
  callback,
  armasAux
) => {
  mostrarSpinner();
  let monstruo = {
    nombre: nombreAux,
    tipo: tipoAux,
    alias: aliasAux,
    defensa: defensaAux,
    miedo: miedoAux,
    armas: armasAux
  };
  fetch('http://localhost:3000/monstruos', {
    method: "POST",
    headers:{
      'content-type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(monstruo)
  })
  .then((res) => (res.ok ? res.json() : Promise.reject(res)))
  .then((data) => console.log(data))
  .catch((res) => console.error(`Error ${res.status}: ${res.statusText}`))
  .finally(() => {
    ocultarSpinner();
    mostrarAlerta("Se Guardo correctamente");
    callback();
  });
};

const editarMonstruo = (
  nombreAux,
  tipoAux,
  aliasAux,
  defensaAux,
  miedoAux,
  callback,
  armasAux
) => {
  mostrarSpinner();
  console.log("muestro spinner");
  
    const monstruoId = document.getElementById("btnSubmitEditar").dataset.monstruoId;
    mostrarSpinner();
    let monstruo = {
      nombre: nombreAux,
      tipo: tipoAux,
      alias: aliasAux,
      defensa: defensaAux,
      miedo: miedoAux,
      armas: armasAux
    };
    fetch(`http://localhost:3000/monstruos/${monstruoId}`, {
      method: "PUT",
      headers:{
        'content-type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(monstruo)
    })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => console.log(data))
    .catch((res) => console.error(`Error ${res.status}: ${res.statusText}`))
    .finally(() => {
      ocultarSpinner();
      mostrarAlerta("Se edito correctamente");
      document.getElementById("btnSubmitEditar").style.visibility = "hidden";
      document.getElementById("btnSubmitGuardar").style.visibility = "visible";
      callback();
    });
};

const formulario = document.querySelector("#formCargarMonstruo");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const btnSubmitGuardar = document.getElementById("btnSubmitGuardar");
  const btnSubmitEditar = document.getElementById("btnSubmitEditar");

  const nombre = document.querySelector("#frmNombre").value;
  const tipo = document.querySelector("#frmTipo").value;
  const alias = document.querySelector("#frmAlias").value;
  const defensa = document.querySelector(
    'input[name="frmDefensa"]:checked'
  ).value;
  const miedo = document.querySelector("#frmMiedo").value;

  const armas = Array.from(
    document.querySelectorAll('input[name="armas"]:checked')
  ).map((input) => input.value);

  if (armas.length == 0) {
    alert("Tiene que seleccionar un arma");
    return;
  }

  let listaMonstruos = JSON.parse(localStorage.getItem("monstruos")) || [];

  if (listaMonstruos == undefined) {
    listaMonstruos = [];
  }

  if (e.submitter === btnSubmitGuardar) {
    listaMonstruos = guardarMonstruo(
      nombre,
      tipo,
      alias,
      defensa,
      miedo,
      crearTabla,
      armas
    );
  } else if (e.submitter === btnSubmitEditar) {
    listaMonstruos = editarMonstruo(
      nombre,
      tipo,
      alias,
      defensa,
      miedo,
      crearTabla,
      armas
    );
  }

  formulario.reset();
});

formulario.addEventListener("reset", (e) => {
  document.getElementById("btnSubmitEditar").style.visibility = "hidden";
  document.getElementById("btnSubmitGuardar").style.visibility = "visible";
});

const botonesMonstruos = document.querySelectorAll(".btnMonstruos");

botonesMonstruos.forEach((btnMonstruo) => {
  btnMonstruo.addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("formMonstruos").style.display = "none";
    document.getElementById("sectionTabla").style.display = "none";
    document.getElementById("tituloForm").style.display = "none";
    document.getElementById("cardsMonstruos").style.display = "block";

    crearCards();
  });
});

const botonesInicio = document.querySelectorAll(".btnInicio");

botonesInicio.forEach((btnInicio) => {
  btnInicio.addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("formMonstruos").style.display = "block";
    document.getElementById("sectionTabla").style.display = "block";
    document.getElementById("tituloForm").style.display = "block";
    document.getElementById("cardsMonstruos").style.display = "none";

    crearTabla();
  });
});

export { Monstruo };
