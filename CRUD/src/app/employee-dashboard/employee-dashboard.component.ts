import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ApiService } from '../Shared/api.service';
import { EmployeeModel } from './employee-dashboard.model';


@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData !: any;
  showAdd !: boolean;
  showUpdate !: boolean;

  constructor(private formbuilber: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilber.group({
      'Firstname': new FormControl(null, Validators.required),
      'Lastname': new FormControl(null, Validators.required),
      'Email': new FormControl(null, [Validators.required, Validators.email]),
      'Phone': new FormControl(null, [Validators.required, Validators.pattern( /^[789][0-9]{9}$/)]),
      'Salary': new FormControl(null, [Validators.required, Validators.pattern('^([1-9][0-9]{1,3}|10000)$')]),

    })
    this.getAllEmployee();
  }


  get Firstname() {
    return this.formValue.get('Firstname');
  }

  get Lastname() {
    return this.formValue.get('Lastname');
  }

  get Email() {
    return this.formValue.get('Email');
  }

  get Phone() {
    return this.formValue.get('Phone');
  }

  get Salary() {
    return this.formValue.get('Salary');
  }


  clickAddEmployee() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }


  postEmployeeDetails() {
    this.employeeModelObj.Firstname = this.formValue.value.Firstname;
    this.employeeModelObj.Lastname = this.formValue.value.Lastname;
    this.employeeModelObj.Email = this.formValue.value.Email;
    this.employeeModelObj.Phone = this.formValue.value.Phone;
    this.employeeModelObj.Salary = this.formValue.value.Salary;

    this.api.postEmploye(this.employeeModelObj)
      .subscribe(res => {
        console.log(res);
        alert("Employee Added Successfully")
        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValue.reset();
        this.getAllEmployee();
      },
        _err => {
          alert('Something went wrong');
        })
  }


  getAllEmployee() {
    this.api.getEmployee()
      .subscribe(res => {
        this.employeeData = res;
      })
  }


  deleteEmployee(row: any) {
    this.api.deleteEmployee(row.id)
      .subscribe(res => {
        alert("Employee Deleted");
        this.getAllEmployee();
      })
  }


  onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeModelObj.id = row.id;
    this.formValue.controls['Firstname'].setValue(row.Firstname);
    this.formValue.controls['Lastname'].setValue(row.Lastname);
    this.formValue.controls['Email'].setValue(row.Email);
    this.formValue.controls['Phone'].setValue(row.Phone);
    this.formValue.controls['Salary'].setValue(row.Salary);
  }
  updateEmployeeDetails() {
    this.employeeModelObj.Firstname = this.formValue.value.Firstname;
    this.employeeModelObj.Lastname = this.formValue.value.Lastname;
    this.employeeModelObj.Email = this.formValue.value.Email;
    this.employeeModelObj.Phone = this.formValue.value.Phone;
    this.employeeModelObj.Salary = this.formValue.value.Salary;

    this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id)
      .subscribe(res => {
        alert('Updated Successfully');
        let ref = document.getElementById('cancel')
        ref?.click()
        this.formValue.reset()
        this.getAllEmployee()
      })
  }

}