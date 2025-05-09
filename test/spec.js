import { expect } from 'chai';
import {
    checkNoRecordFound,
    checkTimeCancellable,
    checkStatusCancellable,
    checkNonExistentId,
    checkProccessingRequest,
    checkInvalidField,
    checkRequiredField,
    checkRequestLength,
    checkIdLength,
    checkAlreadyCancelledInModifying,
    checkProccessingInModifying,
    makeTransactionError,
} from '../services/dbDataCheck.js';
import {
  checkDateRange,
  checkFieldMissing,
  checkNameLength,
  checkPhoneNumberFormat,
  checkDateFormat,
  checkPageNumber,
  checkPageLimit,
} from '../services/validationCheck.js';
import mongoose from 'mongoose';
import Pickup from '../models/Pickup.js';
import { cancelPickup } from '../services/pickupService.js';
import env from '../config/env.js';
import { immutableField, requiredField } from '../config/constants.js';

// create 등록
describe("Barco Clean Server", () => {

  describe("👕👚 Create a pickup", () => {
    it("수거 요청에 필요한 모든 필드가 존재해야한다", () => {
      const pickupData = {
        "customerName": "brotherhood4",
        "address": "seoulCity",
        "phoneNumber": "010-1234-5555",
        "requestDetails": "be nice"
      }

      expect(()=>{
        checkFieldMissing(pickupData);
      }).to.not.throw();
    })

    it("customerName 은 2-50자 이어야한다", () => {
      const pickupData = {
        "customerName" : "브라덜"
      }

      expect(()=>{
        checkNameLength(pickupData);
      }).to.not.throw();
    })

    it(`전화번호 형식은 "010-XXXX-XXXX" 이어야한다`, () => {
      const pickupData = {
        "phoneNumber" : "010-1111-1111"
      }

      expect(()=>{
        checkPhoneNumberFormat(pickupData);
      }).to.not.throw();
    })

  })

// get 조회
  describe("👕👚 Query pickups", () => {
    it("시작일보다 종료일 보다 앞선 날짜여야한다", () => {
      const startDate = '2025-05-12';
      const endDate = '2025-05-12';

      expect(()=>{
        checkDateRange(startDate, endDate);
      }).to.not.throw();
    })

    it(`날짜 형식은 yyyy-mm-dd 이어야한다`, () => {
      const start = '2025-01-01';
      const end = '2025-02-02';
      const startDate = new Date(start);
      const endDate = new Date(end);

      expect(()=>{
        checkDateFormat(startDate, endDate);
      }).to.not.throw();
    })

    it("페이지 번호는 1 이상의 숫자여야한다", () => {
      // const pageNumber = 0.5;
      const pageNumber = 2;

      expect(()=>{
        checkPageNumber(pageNumber);
      }).to.not.throw();
    })

    it("페이지당 항목 수는 최대 100개까지만 가능하다", () => {
      // const pageLimit = 101;  // 통과 x
      const pageLimit = 100;  // 통과 o

      expect(()=>{
        checkPageLimit(pageLimit);
      }).to.not.throw();
    })
  })

// post 취소
  describe("👕👚 Cancel a pickup", () => {
    let testId;
    beforeEach(async() => {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(env.MONGODB_URI);
      }
      const pickupData = {
        customerName: "cancelName1",
        address: "atlas",
        phoneNumber: "010-1234-0001",
        requestDetails: "please be nice",
        status: "PENDING",
      }
      const dbCreatePickup = await Pickup.create(pickupData);
      testId = dbCreatePickup._id;

    })
    afterEach(async() => {
      await Pickup.findByIdAndDelete(testId);
      await mongoose.disconnect();
    })

    it("접수 후 1시간 이내일 경우 통과 (통합테스트)", async() => {
      // const result = await Pickup.findById(testId);
      const result = await cancelPickup(testId);
      expect(result.status).to.eql("CANCELLED");
    })

    it("접수 후 1시간 이내일 경우 통과 (단위테스트)", () => {
      const dbCancelPickup = {
        createdAt: new Date(Date.now() - (30 * 60 * 1000)) // 30분전
      };

      expect(()=>{
        checkTimeCancellable(dbCancelPickup);
      }).to.not.throw();
    })

    it("이미 취소된 요청이 아니어야 한다", () => {
      // id를 통해 db에서 조회해온 결과의 status가 "CANCELLED"가 아니어야 한다
      const dbCancelPickup = {
        status: "PENDING"
      }

      expect(() => {
        checkStatusCancellable(dbCancelPickup)
      }).to.not.throw();
    })

    it("이미 처리 중인 요청이 아니어야 한다", () => {
      const dbCancelPickup = {
        status: "PENDING"
      }
      expect(() => {
        checkProccessingRequest(dbCancelPickup)
      }).to.not.throw();
    })


  })

// patch 수정
  describe("👕👚 Update a pickup", () => {

    it("수정가능한 필드만 포함되어 있어야한다", () => {
      const updateData = {
        customeName: "123123"
      }
      expect(() => {
        checkInvalidField(updateData, immutableField)
      }).to.not.throw();
    })

    it("필수 요청사항 필드는 모두 포함되어야 한다", () => {
      const updateData = {
        customerName: "123123",
        phoneNumber: "010-1111-1111",
        requestDetails: "1231232",
        address: "123123",
      }
      expect(() => {
        checkRequiredField(updateData, requiredField)
      }).to.not.throw();
    })

    it("요청사항은 10 - 1000자를 충족해야한다", () => {
      const updateData = {
        requestDetails: "10자 이상의 요청샘플입니다",
      }
      expect(() => {
        checkRequestLength(updateData)
      }).to.not.throw();
    })

    it("아이디는 24자리 문자열이어야한다", () => {
      const id = "111122223333444455556666";
      expect(() => {
        checkIdLength(id)
      }).to.not.throw();
    })




  })

})
// rateLimit 은 무엇을 테스트 할지

