import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
})
export class DetallePage implements OnInit {
  tareaEditando: Tarea;
  id: string;
  arrayColeccionTareas: any = [{
    id: "",
    data: {} as Tarea,

  }];


  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) { 
    this.tareaEditando = {} as Tarea;
    this.obtenerListaTareas();


  }

  document: any = {
    id:"",
    data: {} as Tarea
  };

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

  ngOnInit() {

    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if(idRecibido!=null){
      this.id = idRecibido;
    }else{
      this.id= "";
    }

    this.firestoreService.consultarPorId("tareas", this.id).subscribe((resultado:any) => {

      if(resultado.payload.data() != null){
        this.document.id = resultado.payload.id;
        this.document.data = resultado.payload.data();
    
        console.log(this.document.data.titulo);
    
      }else{
    
    this.document.data = {} as Tarea;
    
      }


  });
  }
  idTareaSelec: string;

  clicBotonBorrar() {
    this.firestoreService.borrar("tareas", this.id).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Tarea;
      this.router.navigate(['/']);
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("tareas", this.id, this.tareaEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTareas();
      // Limpiar datos de pantalla
      this.tareaEditando = {} as Tarea;
    })
  }







}
