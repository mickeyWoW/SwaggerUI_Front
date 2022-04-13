import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { RolesService } from "src/app/core/services/roles.service";
import { UserService } from "src/app/core/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  @ViewChild("modal") modal: TemplateRef<any>;
  isLoader: boolean;
  search = null;
  form: FormGroup;
  users: any;
  roles: any;
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private roleService: RolesService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllRoles();
    this.getAllUsers();
  }
  createForm() {
    this.form = this.fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      role_id: [null, Validators.required],
      avatar: [null, Validators.required],
    });
  }
  getAllUsers() {
    this.isLoader = true;
    this.userService.getAllUsers().subscribe(
      (response) => {
        console.log("warehouses", response);
        this.users=[];
        response.forEach((x) => {
          x.checkbox = false;
          this.users.push(x);
        });
        this.isLoader = false;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  getAllRoles() {
    this.isLoader = true;
    this.roleService.getAllRoles().subscribe(
      (response) => {
        console.log("Roles", response);
        this.isLoader = false;
        this.roles = response;
      },
      (error) => {
        this.isLoader = false;
        Swal.fire("Error occured while retrieving the list", "", "error");
      },
    );
  }
  open() {
    this.modalService.open(this.modal);
  }
  checkAll(e) {
    console.log(e);
    this.users.forEach((x) => {
      x.checkbox = e;
    });
  }
  checkSingle(i) {
    this.users[i].checkbox = !this.users[i].checkbox;
  }
}
