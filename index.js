const formulario = document.getElementById("formulario");
    const entrada = document.getElementById("tarea");
    const lista = document.getElementById("lista");
    const mensaje = document.getElementById("mensaje");

    // Recuperar tareas guardadas
    let tareas = [];

    try {
      const guardadas = localStorage.getItem("misTareas");
      const datos = guardadas ? JSON.parse(guardadas) : [];

      if (Array.isArray(datos)) {
        tareas = datos.filter(t =>
          t &&
          typeof t.nombre === "string" &&
          typeof t.completada === "boolean" &&
          (typeof t.id === "string" ||
           typeof t.id === "number")
        );
      }
    } catch (error) {
      tareas = [];
    }

    // Guardar en localStorage
    function guardarTareas() {
      localStorage.setItem("misTareas", JSON.stringify(tareas));
    }

    // Agregar una tarea
    formulario.addEventListener("submit", function(e) {
      e.preventDefault();

      const nombre = entrada.value.trim();

      if (nombre === "") return;

      tareas.push({
        id: Date.now().toString() + Math.random(),
        nombre: nombre,
        completada: false
      });

      guardarTareas();
      mostrarTareas();

      entrada.value = "";
      entrada.focus();
    });

    // Mostrar las tareas
    function mostrarTareas() {
      lista.innerHTML = "";

      tareas.forEach(function(tarea) {
        const elemento = document.createElement("li");
        elemento.className =
          "list-group-item d-flex align-items-center gap-2 py-3";

        const texto = document.createElement("span");
        texto.textContent = tarea.nombre;
        texto.className = "flex-grow-1";

        if (tarea.completada) {
          texto.classList.add("completada");
        }

        // Botón completar
        const botonCompletar = document.createElement("button");
        botonCompletar.type = "button";
        botonCompletar.className =
          tarea.completada
            ? "btn btn-outline-secondary btn-sm"
            : "btn btn-success btn-sm";

        botonCompletar.textContent =
          tarea.completada ? "Desmarcar" : "Completar";

        botonCompletar.addEventListener("click", function() {
          tarea.completada = !tarea.completada;
          guardarTareas();
          mostrarTareas();
        });

        // Botón eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn btn-danger btn-sm";
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", function() {
          tareas = tareas.filter(t => t.id !== tarea.id);
          guardarTareas();
          mostrarTareas();
        });

        elemento.append(texto, botonCompletar, botonEliminar);
        lista.appendChild(elemento);
      });

      // Actualizar estadísticas
      document.getElementById("total").textContent = tareas.length;

      document.getElementById("completadas").textContent =
        tareas.filter(t => t.completada).length;

      document.getElementById("pendientes").textContent =
        tareas.filter(t => !t.completada).length;

      mensaje.textContent = tareas.length === 0
        ? "No hay tareas registradas."
        : "";

      mensaje.classList.toggle("d-none", tareas.length !== 0);
    }

    // Mostrar las tareas al abrir la página
    mostrarTareas();