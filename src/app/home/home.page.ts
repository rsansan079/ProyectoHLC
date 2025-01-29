import { Component } from '@angular/core';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  tareaEditando: Tarea;
  arrayColeccionTareas: any = [{
    id: "",
    data: {} as Tarea,

  }];




  constructor(private firestoreService: FirestoreService, private router: Router) {
    // Crear una tarea vacía al empezar
    this.tareaEditando = {} as Tarea;
    this.obtenerListaTareas();
  }




  clickBotonInsertar() {
    if (!this.tareaEditando.titulo || !this.tareaEditando.descripcion) {
      console.error('Error: La tarea no tiene datos válidos.');
      return;
    }
  
    this.firestoreService.insertar("tareas", this.tareaEditando)
      .then(() => {
        console.log('Tarea creada correctamente');
  
        // Agregar la nueva tarea manualmente al inicio del array
        this.arrayColeccionTareas.unshift({
          data: { ...this.tareaEditando }
        });
  
        // Limpiar el contenido de la tarea que se está editando
        this.tareaEditando = {} as Tarea;
  
        // Filtrar elementos vacíos en la lista
        this.arrayColeccionTareas = this.arrayColeccionTareas.filter(tarea =>
          tarea.data.titulo && tarea.data.descripcion
        );
      })
      .catch((error) => {
        console.error('Error al crear la tarea:', error);
      });
  }
  



  obtenerListaTareas() {
    this.firestoreService.consultar("tareas").subscribe((resultadoConsultaTareas) => {

      this.arrayColeccionTareas = [];
      resultadoConsultaTareas.forEach((datosTarea: any) => {
        this.arrayColeccionTareas.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        })
      })
    }
    )
  }


  idTareaSelec: string;

  selecTarea(tareaSelec) {
    console.log("Tarea seleccionada: ");
    console.log(tareaSelec);
    this.idTareaSelec = tareaSelec.id;
    this.tareaEditando.titulo = tareaSelec.data.titulo;
    this.tareaEditando.descripcion = tareaSelec.data.descripcion;
    this.router.navigate(['/detalle', this.idTareaSelec]);
  }




  navegarAAgregar() {
    this.router.navigate(['/detalle', 'nuevo']);
  }





}
