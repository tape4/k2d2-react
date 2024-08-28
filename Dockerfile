# Node.js 이미지를 기반으로 사용 (LTS 버전)
FROM node:18

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# 애플리케이션 실행
CMD ["npm", "start"]

# 컨테이너가 사용할 포트 정의
EXPOSE 3000