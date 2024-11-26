import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ProductoModel } from '../model/producto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crud_app';

  productObj:ProductoModel = new ProductoModel();
  productForm:FormGroup = new FormGroup({});
  producList:ProductoModel[] = [];

constructor()
{
  this.crearFormulario();
  const oldData = localStorage.getItem("dataProd");
  if(oldData!=null)
  {
  //Convirtiendo los datos a tipo JSON
    const parseData = JSON.parse(oldData);
    this.producList = parseData;
  }
}

crearFormulario()
{
  this.productForm = new FormGroup({
    id: new FormControl(this.productObj.id),
    descripcion: new FormControl(this.productObj.descripcion, [Validators.required]),
    precio: new FormControl(this.productObj.precio, [Validators.required, Validators.minLength(3)]),
  });
}

onSave(){
  const oldData = localStorage.getItem("dataProd");
  if(oldData!=null)
  {
    //Convirtiendo los datos a tipo JSON
    const parseData = JSON.parse(oldData);
    this.productForm.controls['id'].setValue(parseData.length+1);
    //Guardar registro en almacenamiento local
    this.producList.unshift(this.productForm.value);
  }
  else
  {
    this.producList.unshift(this.productForm.value);
  }
  //Guardar registro en almacenamiento local
  localStorage.setItem("dataProd", JSON.stringify(this.producList));
  this.limpiar();
}

onEdit(item:ProductoModel)
{
  this.productObj=item;
  this.crearFormulario();
}

limpiar(){
  this.productObj=new ProductoModel;
  this.crearFormulario();
}
onUpdate()
{
  const registro = this.producList.find(m=>m.id == this.productForm.controls['id'].value);
  if(registro != undefined){
    registro.descripcion = this.productForm.controls['descripcion'].value;
    registro.precio = this.productForm.controls['precio'].value;
  }
    //Guardar registro en almacenamiento local
    localStorage.setItem("dataProd", JSON.stringify(this.producList));
    this.limpiar();
}

onDelete(id:number){
  const borrar = confirm("¿Está seguro de eliminar este registro?");
  if(borrar)
  {
      //recuperar indice de registro que voy a eliminar
    const indice = this.producList.findIndex(m=>m.id);
    //eliminar registro de la lista
    this.producList.splice(indice,1);
  }
  localStorage.setItem("dataProd", JSON.stringify(this.producList));
}
}
