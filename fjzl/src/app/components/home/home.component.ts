import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchInfo: any = {};
  userInfo: any = {
    idType: "0",
    ageType: "0"
  };
  patientMedicalInfo: any = {};
  outOrgInfo: any = {};
  inOrgInfo: any = {};
  transferDetail: any = {};

  transferOptions = [
    {
      label: "受限于我院治疗能力、医疗器械、技术条件等",
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
      label: "诊断不明",
      value: "3"
    },
    {
      label: "家属自愿要求",
      value: "4"
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
  constructor(
    public route: ActivatedRoute,
    private http: HttpClient,
    private message: NzMessageService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      // 判断来源（his免登陆 OR login页面）
      if (typeof param == "object" && Object.keys(param).length > 0) {
        this.fromLogin = false;
        this.disabled = false;
        this.confirmText = "提交"
        this.userInfo = {
          patientNo: param.patientId,
          userID: param.idCardNo,
          patientName: param.patientName,
          age: param.age,
          sex: param.gender,
          birthday: param.birthday,
          telephone: param.phoneNumber,
          address: param.address,
          contactName: param.contactPerson,
          contactPhone: param.contactPhone,
          from: param.patientSource,
          hospitalNo: param.inHospitalNo,
          clinicNo: param.clinicNo,
          idType: "0",
          ageType: "0"
        }
        this.patientMedicalInfo = {
          diagnose: param.diagnosis,
          description: param.description,
          summary: param.outSummary,
          costType: param.costType,
          history: param.illnessHistory
        }
        this.inOrgInfo = {
          direction: "2"
        }
      } else {
        this.userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
        this.patientMedicalInfo = JSON.parse(window.localStorage.getItem("patientMedicalInfo")) || {};
        // this.outOrgInfo = JSON.parse(window.localStorage.getItem("outOrgInfo"));
        this.inOrgInfo = JSON.parse(window.localStorage.getItem("inOrgInfo")) || {};
      }
    });
  }

  clear() {
    if (!this.disabled) {
      this.userInfo = {};
      this.patientMedicalInfo = {};
      this.inOrgInfo = {};
    }
  }
  submit() {
    this.loading = true;
    // let data = new FormData();
    // data.append("patientName",this.userInfo.patientName);
    // data.append("idCardNo",this.userInfo.userID);
    // data.append("inDeptCode",this.inOrgInfo.inDept);
    // data.append("inDeptName","妇保科",);
    // data.append("inDoctorCode",this.inOrgInfo.inDoctor);
    // data.append("inDoctorName",this.getDocName(this.inOrgInfo.inDoctor));
    let data = new HttpParams({ fromObject: { 
      patientName: this.userInfo.patientName,
      idCardNo: this.userInfo.userID,
      inDeptCode: this.inOrgInfo.inDept,
      inDeptName: "妇保科",
      inDoctorCode: this.inOrgInfo.inDoctor,
      inDoctorName: this.getDocName(this.inOrgInfo.inDoctor)
    } });
    if (this.fromLogin) {
      this.http.post<any>("http://193.112.74.16:8089/commit/his", data, {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          })
        })
        .subscribe(res => {
          this.loading = false;
          this.message.create("success", `数据保存成功!!!`);
          this.userInfo = {};
          this.patientMedicalInfo = {};
          this.inOrgInfo = {};
        }, error => {
          this.loading = false;
          this.message.create("error", `数据保存失败...`);
        }, () => {
        });
    } else {
      window.localStorage.setItem("userInfo", JSON.stringify(this.userInfo));//患者基本信息
      window.localStorage.setItem("patientMedicalInfo", JSON.stringify(this.patientMedicalInfo));//患者基本医疗信息
      // window.localStorage.setItem("outOrgInfo", JSON.stringify(this.outOrgInfo));//转出医疗机构信息
      window.localStorage.setItem("inOrgInfo", JSON.stringify(this.inOrgInfo));//转入医疗机构信息
      setTimeout(() => {
        this.loading = false;
        this.userInfo = {};
        this.patientMedicalInfo = {};
        this.inOrgInfo = {};
        this.message.create("success", `数据保存成功!!!`);
      }, 3000);
    }
  }

  onChange(e) {

  }

  getDocName(code) {
    switch (code) {
      case "lt502":
        return "靳爱军";
      case "lt509":
        return "文富英";
      case "lt518":
        return "龙小兰"
      default:
        return ""
    }

  }

}
