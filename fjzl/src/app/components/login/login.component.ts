import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.route.navigate(["/home"], {
        queryParams: {
          patientId: "123456",
          idCardNo: "370685199201010000",
          patientName: "李四",
          phoneNumber: "15002951657",
          patientSource: "1",
          inHospitalNo: "666",
          clinicNo: "666",
          admissionTimes: "",
          cardNo: "",
          gender: 1,
          age: 45,
          birthday: "1966/10/10",
          address: "家庭地址测试",
          costType: "2",
          diagnosis: "初步诊断测试文字001；初步诊断测试文字002",
          description: "病情详细描述测试文字",
          outSummary: "出院小结测试文字。",
          birthPlaceProv: "",
          birthPlaceArea: "",
          postcode: "720000",
          countryCode: "0513",
          nationCode: "00001",
          careerCode: "0002",
          contactPerson: "张三",
          contactPhone: "15012345678",
          illnessHistory: "暂无既往史"
        }
      });
    }
  }
  constructor(private fb: FormBuilder, private route: Router) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
}
