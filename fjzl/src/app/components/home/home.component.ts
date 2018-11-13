import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchInfo:any = {};
  userInfo :any = {
    idType: "0",
    ageType: "0"
  };
  patientMedicalInfo:any = {};
  outOrgInfo:any = {};
  inOrgInfo:any = {};
  transferDetail:any = {};

  transferOptions = [
    {
      label: "对该病诊断不明或我院治疗能力、技术条件等受限",
      value: "0"
    },
    {
      label: "急危病重患者",
      value: "1"
    },
    {
      label: "病情稳定或好转可转下一级医疗机构继续或康复治疗",
      value: "2"
    },
    {
      label: "对该病我院有诊治能力，患者（家属）拒绝在我院诊治，要求转其他医院诊治",
      value: "3"
    }
  ];
  transferNodes = [
    {
      title: '上转指征',
      key: '100',
      children: [{
        title: '不具备相关医疗技术临床应用资质或手术资质',
        key: '1001'
      }, {
        title: '不能明确诊断，需要进一步诊治',
        key: '1002'
      }]
    },
    {
      title: '下转指征',
      key: '200',
      children: [{
        title: '诊断明确、经处理后病情稳定，仍需继续住院进一步治疗',
        key: '2001'
      }, {
        title: '各类手术后病情稳定，需进一步康复医疗',
        key: '2002'
      }]
    }
  ];
  deptNodes = [

  ];
  fromLogin = true;
  disabled = true;
  confirmText = "确认"
  loading = false;
  constructor(public route: ActivatedRoute, private http: HttpClient) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      // 判断来源（his免登陆 OR login页面）
      if(typeof param == "object" && Object.keys(param).length > 0){
        this.fromLogin = false;
        this.disabled = false;
        this.confirmText = "提交"
      } 
      this.userInfo = {
        patientNo:param.patientId,
        userID:param.idCardNo,
        patientName:param.patientName,
        age:param.age,
        sex:param.gender,
        birthday:param.birthday,
        telephone:param.phoneNumber,
        address:param.address,
        contactName:param.contactPerson,
        contactPhone:param.contactPhone,
        from:param.patientSource,
        hospitalNo:param.inHospitalNo,
        clinicNo:param.clinicNo,
        idType: "0",
        ageType: "0"
      }
      this.patientMedicalInfo={
        diagnose:param.diagnosis,
        description:param.description,
        summary:param.outSummary,
        costType:param.costType,
        history:param.illnessHistory
      },
      this.inOrgInfo = {
        direction:"2"
      }
    });
  }

  clear(){
    if(!this.disabled){
      this.patientMedicalInfo={};
      this.outOrgInfo = {};
      this.inOrgInfo={};
    }
  }
  submit(){
    this.http.post<any>("",{

    }).pipe(
      mergeMap(token=>{
        return this.http.post("",{})
      })
    ).subscribe(res=>{
      console.log("success");
    },error=>{
      console.log("error");
    },()=>{
      console.log("complete");
    })
    this.loading = true;
  }

}
