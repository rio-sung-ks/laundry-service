<br>
<br>

<p align="center">
  <img src="/vaco.png"  width="50%">
</p>

<br>
<br>

> 바닐라코딩의 모든 과제는 실제 기업에서 주어지는 과제에 기반하여 제작되었으며, 저작권법의 보호를 받습니다. 개인 블로그 등의 공개된 장소에 관련 내용을 공유하거나 개인적으로 지인들과 공유하는 등의 행위는 삼가해주시기 바랍니다.

<br>
<br>

# 🧼 Welcome to Barco Clean Server Team
<br>

<p align="center">
  <img src="/barco.png"  width="100%">
</p>

<br>

> 우리는 오늘도 셔츠 하나에 진심입니다.
<br>

_📍 14 Rue des Archives, 75004 Paris, France - Paris HQ_

<br>

**Barco Clean**은 **프랑스 파리 15구**에 본사를 둔 급성장 중인 온디맨드 세탁 스타트업입니다.
**시리즈 A 투자 완료**, **MAU 40,000명 이상**, **일 평균 세탁 요청 1,500건**을 처리하는 실시간 물류 서비스로 성장 중입니다.

<br>
<br>

## 🎯 이번 미션의 목표
<br>

운영팀은 하루에도 수십 건의 수거 요청과 변경 요청, 문의에 시달리고 있습니다.
**우리는 이 혼란을 끝낼 백오피스 API를 구현해야 합니다.**

당신은 이제 막 합류한 백엔드 팀원 **Émile**입니다.
**이번 미션의 목표는 운영팀을 위한 안정적인 백엔드 API를 구현하는 것입니다.**

<br>
<br>

## 💼 시나리오 기반 업무 요청
<br>

> 이번 미션에서는 프론트엔드 팀이 API 스펙을 기다리고 있습니다.
> REST API 스펙은 이미 정의되어 있으며, 각 엔드포인트별 요청/응답 형식과 오류 케이스가 상세히 명시되어 있습니다.
> 프론트엔드 팀이 개발을 시작할 수 있도록, 이 스펙을 바탕으로 백엔드의 전체 흐름을 설계하고 구현해야 합니다.

<br>

### ✅ (고객) 수거 요청 등록

- 고객은 이름, 주소, 전화번호, 요청사항을 입력하고 수거 요청을 보냅니다.
- 요청이 서버에 저장되고, 이후 조회/취소/수정 대상이 됩니다.

<br>

#### API 구조

```
POST /api/pickups
Content-Type: application/json

Request Body:
{
  "customerName": string,     // 필수, 2-50자
  "address": string,          // 필수, 5-200자
  "phoneNumber": string,      // 필수, 전화번호 형식 (010-XXXX-XXXX)
  "requestDetails": string    // 필수, 10-1000자
}
```

<br>

<details>
   <summary>성공 케이스</summary>

```
POST /api/pickups
Content-Type: application/json

{
  "customerName": "김바코",
  "address": "서울시 강남구 테헤란로 123",
  "phoneNumber": "010-1234-5678",
  "requestDetails": "셔츠 3벌, 바지 2벌 세탁 부탁드립니다. 셔츠는 스타치 처리해주세요."
}

Response (201 Created):
{
  "id": "507f1f77bcf86cd799439011",
  "customerName": "김바코",
  "address": "서울시 강남구 테헤란로 123",
  "phoneNumber": "010-1234-5678",
  "requestDetails": "셔츠 3벌, 바지 2벌 세탁 부탁드립니다. 셔츠는 스타치 처리해주세요.",
  "status": "PENDING",
  "createdAt": "2024-03-15T14:30:00Z",
  "updatedAt": "2024-03-15T14:30:00Z"
}
```
</details>

<details>
   <summary>오류 케이스 - 필수 필드 누락</summary>

```
POST /api/pickups
Content-Type: application/json

{
  "customerName": "김바코",
  "phoneNumber": "010-1234-5678"
}

Response (400 Bad Request):
{
  "error": {
    "code": "MISSING_REQUIRED_FIELD",
    "message": "필수 필드가 누락되었습니다.",
    "details": {
      "field": "address",
      "constraint": "required"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 이름 길이</summary>

```
POST /api/pickups
Content-Type: application/json

{
  "customerName": "김",
  "address": "서울시 강남구 테헤란로 123",
  "phoneNumber": "010-1234-5678",
  "requestDetails": "셔츠 3벌 세탁 부탁드립니다."
}

Response (400 Bad Request):
{
  "error": {
    "code": "INVALID_NAME_LENGTH",
    "message": "이름은 2-50자 사이여야 합니다.",
    "details": {
      "field": "customerName",
      "value": "김",
      "constraint": "length: 2-50"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 연락처 형식</summary>

```
POST /api/pickups
Content-Type: application/json

{
  "customerName": "김바코",
  "address": "서울시 강남구 테헤란로 123",
  "phoneNumber": "01012345678",
  "requestDetails": "셔츠 3벌 세탁 부탁드립니다."
}

Response (400 Bad Request):
{
  "error": {
    "code": "INVALID_PHONE_FORMAT",
    "message": "올바른 전화번호 형식이 아닙니다.",
    "details": {
      "field": "phoneNumber",
      "value": "01012345678",
      "constraint": "format: XXX-XXXX-XXXX"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 요청 횟수 초과</summary>

```
POST /api/pickups
Content-Type: application/json

{
  "customerName": "김바코",
  "address": "서울시 강남구 테헤란로 123",
  "phoneNumber": "010-1234-5678",
  "requestDetails": "셔츠 3벌 세탁 부탁드립니다."
}

Response (429 Too Many Requests):
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.",
    "details": {
      "retryAfter": 60,
      "limit": 100,
      "remaining": 0
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 서버 내부 오류</summary>

```
POST /api/pickups
Content-Type: application/json

{
  "customerName": "김바코",
  "address": "서울시 강남구 테헤란로 123",
  "phoneNumber": "010-1234-5678",
  "requestDetails": "셔츠 3벌 세탁 부탁드립니다."
}

Response (500 Internal Server Error):
{
  "error": {
    "code": "DATABASE_ERROR",
    "message": "데이터베이스 처리 중 오류가 발생했습니다.",
    "details": {
      "errorCode": "DB_CONNECTION_ERROR",
      "timestamp": "2024-03-15T14:30:00Z"
    }
  }
}
```
</details>

<br>

### ✅ (운영팀) 수거 요청 조회

- 운영팀은 날짜 범위 기반으로 요청 내역을 확인하고 싶어 합니다.
- `?start=2024-01-01&end=2024-01-03` 같은 형식의 날짜 쿼리로 필터링이 필요합니다.
- 조회 날짜에 대한 제한은 특별히 없습니다.

#### API 구조

```
GET /api/pickups?start=2024-03-01&end=2024-03-15&page=1&limit=20&status=PENDING

Query Parameters:
- start: string (필수) - ISO 8601 형식의 시작 날짜 (YYYY-MM-DD)
- end: string (필수) - ISO 8601 형식의 종료 날짜 (YYYY-MM-DD)
- page: number (선택) - 페이지 번호, 기본값 1
- limit: number (선택) - 페이지당 항목 수, 기본값 20, 최대 100
- status: string (선택) - 필터링할 상태값 (PENDING, CANCELLED, UPDATED)
```

<br>

<details>
   <summary>성공 케이스</summary>

```
GET /api/pickups?start=2024-03-01&end=2024-03-15&page=1&limit=10&status=PENDING

Response (200 OK):
{
  "pickups": [
    {
      "id": "507f1f77bcf86cd799439011",
      "customerName": "김바코",
      "address": "서울시 강남구 테헤란로 123",
      "phoneNumber": "010-1234-5678",
      "requestDetails": "셔츠 3벌, 바지 2벌 세탁 부탁드립니다.",
      "status": "PENDING",
      "createdAt": "2024-03-15T14:30:00Z",
      "updatedAt": "2024-03-15T14:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```
</details>

<details>
   <summary>오류 케이스 - 날짜 형식</summary>

```
GET /api/pickups?start=2024-03-01&end=invalid-date

Response (400 Bad Request):
{
  "error": {
    "code": "INVALID_DATE_FORMAT",
    "message": "올바른 날짜 형식이 아닙니다.",
    "details": {
      "field": "end",
      "value": "invalid-date",
      "constraint": "YYYY-MM-DD"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 날짜 범위</summary>

```
GET /api/pickups?start=2024-03-15&end=2024-03-01

Response (400 Bad Request):
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "종료일이 시작일보다 이전일 수 없습니다.",
    "details": {
      "start": "2024-03-15",
      "end": "2024-03-01"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 페이지 번호</summary>

```
GET /api/pickups?start=2024-03-01&end=2024-03-15&page=0

Response (400 Bad Request):
{
  "error": {
    "code": "INVALID_PAGE_NUMBER",
    "message": "페이지 번호는 1 이상이어야 합니다.",
    "details": {
      "field": "page",
      "value": 0,
      "constraint": "min: 1"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - limit</summary>

```
GET /api/pickups?start=2024-03-01&end=2024-03-15&limit=150

Response (400 Bad Request):
{
  "error": {
    "code": "INVALID_LIMIT",
    "message": "페이지당 항목 수는 최대 100개까지 가능합니다.",
    "details": {
      "field": "limit",
      "value": 150,
      "constraint": "max: 100"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 존재하지 않는 데이터</summary>

```
GET /api/pickups?start=2024-03-20&end=2024-03-21

Response (404 Not Found):
{
  "error": {
    "code": "NO_RECORDS_FOUND",
    "message": "해당 기간의 수거 요청이 존재하지 않습니다.",
    "details": {
      "start": "2024-03-20",
      "end": "2024-03-21"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 서버 내부 오류</summary>

```
GET /api/pickups?start=2024-03-01&end=2024-03-15

Response (500 Internal Server Error):
{
  "error": {
    "code": "CACHE_ERROR",
    "message": "캐시 처리 중 오류가 발생했습니다.",
    "details": {
      "errorCode": "REDIS_CONNECTION_ERROR",
      "timestamp": "2024-03-15T14:30:00Z"
    }
  }
}
```
</details>

<br>

### ✅ (고객) 수거 요청 취소

- 접수 후 1시간 이내일 경우에만 취소가 가능합니다.
- 1시간이 지난 요청은 취소 불가이며, 프론트는 서버 응답을 기반으로 안내 메시지를 표시합니다.

<br>

#### API 구조

```
DELETE /api/pickups/:id

Path Parameters:
- id: string (필수) - 수거 요청 ID
```

<br>

<details>
   <summary>성공 케이스</summary>

```
DELETE /api/pickups/507f1f77bcf86cd799439011

Response (200 OK):
{
  "id": "507f1f77bcf86cd799439011",
  "status": "CANCELLED",
  "cancelledAt": "2024-03-15T15:30:00Z"
}
```
</details>

<details>
   <summary>오류 케이스 - 시간 초과</summary>

```
DELETE /api/pickups/507f1f77bcf86cd799439011

Response (400 Bad Request):
{
  "error": {
    "code": "CANCELLATION_TIME_EXPIRED",
    "message": "취소 가능 시간(1시간)이 경과했습니다.",
    "details": {
      "createdAt": "2024-03-15T14:30:00Z",
      "currentTime": "2024-03-15T16:00:00Z",
      "timeElapsed": "1시간 30분"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 이미 취소된 요청</summary>

```
DELETE /api/pickups/507f1f77bcf86cd799439011

Response (400 Bad Request):
{
  "error": {
    "code": "ALREADY_CANCELLED",
    "message": "이미 취소된 요청입니다.",
    "details": {
      "status": "CANCELLED",
      "cancelledAt": "2024-03-15T15:00:00Z"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 존재하지 않는 요청</summary>

```
DELETE /api/pickups/nonexistent_id

Response (404 Not Found):
{
  "error": {
    "code": "PICKUP_NOT_FOUND",
    "message": "해당 수거 요청을 찾을 수 없습니다.",
    "details": {
      "requestId": "nonexistent_id"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 잘못된 요청</summary>

```
DELETE /api/pickups/invalid-id-format

Response (400 Bad Request):
{
  "error": {
    "code": "INVALID_REQUEST_ID",
    "message": "잘못된 요청 ID 형식입니다.",
    "details": {
      "field": "id",
      "value": "invalid-id-format",
      "constraint": "24자리 16진수 문자열"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 이미 처리 중인 요청</summary>

```
DELETE /api/pickups/507f1f77bcf86cd799439011

Response (409 Conflict):
{
  "error": {
    "code": "REQUEST_IN_PROCESS",
    "message": "이미 처리 중인 요청입니다.",
    "details": {
      "status": "PROCESSING",
      "startedAt": "2024-03-15T15:00:00Z"
    }
  }
}
```
</details>

<br>

### ✅ (고객) 수거 요청 수정

- 요청사항 필드만 수정 가능합니다. 이름, 주소, 전화번호는 불가합니다.
- 수정된 요청은 운영팀이 다시 확인할 수 있어야 합니다.

<br>

#### API 구조

```
PATCH /api/pickups/:id
Content-Type: application/json

Path Parameters:
- id: string (필수) - 수거 요청 ID

Request Body:
{
  "requestDetails": string    // 필수, 10-1000자
}
```

<details>
   <summary>성공 케이스</summary>

```
PATCH /api/pickups/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "requestDetails": "셔츠 3벌, 바지 2벌, 양복 1벌 세탁 부탁드립니다. 셔츠는 스타치 처리해주세요."
}

Response (200 OK):
{
  "id": "507f1f77bcf86cd799439011",
  "customerName": "김바코",
  "address": "서울시 강남구 테헤란로 123",
  "phoneNumber": "010-1234-5678",
  "requestDetails": "셔츠 3벌, 바지 2벌, 양복 1벌 세탁 부탁드립니다. 셔츠는 스타치 처리해주세요.",
  "status": "UPDATED",
  "updatedAt": "2024-03-15T16:30:00Z"
}
```
</details>

<details>
   <summary>오류 케이스 - 수정 불가능한 필드 포함</summary>

```
PATCH /api/pickups/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "customerName": "새이름",
  "requestDetails": "수정된 요청사항"
}

Response (400 Bad Request):
{
  "error": {
    "code": "INVALID_UPDATE_FIELD",
    "message": "수정할 수 없는 필드가 포함되어 있습니다.",
    "details": {
      "field": "customerName",
      "constraint": "readonly"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 필수 항목 누락</summary>

```
PATCH /api/pickups/507f1f77bcf86cd799439011
Content-Type: application/json

{}

Response (400 Bad Request):
{
  "error": {
    "code": "MISSING_REQUEST_DETAILS",
    "message": "요청사항 필드는 필수입니다.",
    "details": {
      "field": "requestDetails",
      "constraint": "required"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 필수 항목 길이</summary>

```
PATCH /api/pickups/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "requestDetails": "짧음"
}

Response (400 Bad Request):
{
  "error": {
    "code": "INVALID_REQUEST_LENGTH",
    "message": "요청사항은 10-1000자 사이여야 합니다.",
    "details": {
      "field": "requestDetails",
      "value": "짧음",
      "constraint": "length: 10-1000"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 취소된 요청</summary>

```
PATCH /api/pickups/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "requestDetails": "수정된 요청사항"
}

Response (409 Conflict):
{
  "error": {
    "code": "ALREADY_CANCELLED",
    "message": "취소된 요청은 수정할 수 없습니다.",
    "details": {
      "status": "CANCELLED",
      "cancelledAt": "2024-03-15T15:30:00Z"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 처리 중인 요청</summary>

```
PATCH /api/pickups/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "requestDetails": "수정된 요청사항"
}

Response (409 Conflict):
{
  "error": {
    "code": "REQUEST_IN_PROCESS",
    "message": "처리 중인 요청은 수정할 수 없습니다.",
    "details": {
      "status": "PROCESSING",
      "startedAt": "2024-03-15T15:00:00Z"
    }
  }
}
```
</details>

<details>
   <summary>오류 케이스 - 서버 내부 오류</summary>

```
PATCH /api/pickups/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "requestDetails": "수정된 요청사항"
}

Response (500 Internal Server Error):
{
  "error": {
    "code": "TRANSACTION_ERROR",
    "message": "요청 수정 처리 중 오류가 발생했습니다.",
    "details": {
      "errorCode": "DB_TRANSACTION_FAILED",
      "timestamp": "2024-03-15T16:30:00Z"
    }
  }
}
```
</details>

<br>
<br>

## 📋 CTO Louis의 추가 지시
<br>

### 🔸 에러 핸들링 로직을 응집시켜 주세요.

어떻게 하면 정확하고 효율적으로 에러를 다루며 클라이언트와 소통할 수 있을지 충분히 고민해보세요. 백엔드 작업에서 가장 중요한 부분입니다.

<br>

### 🔸 RESTful API 설계 원칙을 반드시 명심하세요.

우리의 백엔드 아키텍처는 API URL, HTTP Method, 상태 코드, 리소스 중심 설계를 준수합니다.

> 📘 참고: [NHN 기술 블로그 RESTful API](https://meetup.nhncloud.com/posts/92)

> 📘 참고: [RESTful Best Practices - MDN](https://developer.mozilla.org/ko/docs/Glossary/REST)

<br>

### 🔸 데이터베이스 인덱스를 고려하세요.

> 운영팀이 특정 날짜의 요청을 자주 검색한다고?
> 그렇다면, 쿼리 성능을 위해 인덱스를 어떻게 설정해야 할지 먼저 고민해보세요.

필요하다고 판단되는 필드에 인덱스를 설정해보세요.

> 📘 참고: [MongoDB Indexes 공식 문서](https://www.mongodb.com/ko-kr/docs/manual/indexes/)

<br>

### 🔸 데이터베이스 트랜잭션을 고려하세요.

> 수거 요청의 상태 변경이나 수정 작업이 실패하면 어떻게 될까요?
> 데이터의 일관성을 유지하기 위해 트랜잭션 처리가 필요합니다.

다음과 같은 상황에서 트랜잭션 처리를 고려해보세요:
- 수거 요청 취소 시 상태 변경과 취소 시간 기록
- 요청 수정 시 이전 상태 기록과 새로운 상태 업데이트
- 여러 문서를 동시에 수정해야 하는 작업

> 📘 참고: [MongoDB Transactions 공식 문서](https://www.mongodb.com/ko-kr/docs/manual/core/transactions/)

<br>

### 🔸 In-Memory 캐시 전략을 도입해보세요.

> 동일한 날짜의 요청을 반복적으로 조회한다면,
> Redis 같은 인메모리 캐시를 사용하는 것도 고려해보세요.

다음 사례들을 참고해보세요:

- Redis로 최근 수거 요청 내역 캐싱하기

> 📘 참고: [Redis 홈페이지](https://redis.io/docs/latest/)

> 📘 참고: [라인 기술 블로그](https://engineering.linecorp.com/ko/blog/LINE-integrated-notification-center-from-redis-to-mongodb)

<br>
<br>

## 📌 업무 요청 사항

**REST API 서버를 구현합니다.**

- 주어진 스펙에 명시된 것처럼 모든 응답은 JSON 데이터 형식으로 통입합니다.
- 비즈니스 로직 구현 (1시간 취소 제한, 수정 필드 제한 등)
- 필요할 경우, [서비스 로직](https://stackoverflow.com/questions/1440096/difference-between-repository-and-service) 등의 관심사 분리
- 유지보수에 용이한 데이터베이스 설계, 서버 예외 처리

<br>
<br>

## 🧠 Louis의 마지막 한 마디

> 당신이 만든 API가, 우리 운영팀의 일상을 결정합니다.
> 서버 하나로 셔츠 천 장의 행방이 달라질 수 있다는 걸 기억하세요.

<br>
