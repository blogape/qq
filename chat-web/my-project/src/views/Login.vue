<template>
  <div class="login">
    <el-form
      :model="ruleForm2"
      status-icon
      :rules="rules2"
      ref="ruleForm2"
      label-width="70px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="age">
        <el-input v-model.number="ruleForm2.age" maxlength="8"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      setTimeout(() => {
        // if (!Number.isInteger(value)) {
        //   callback(new Error('请输入数字值'));
        // } else {
        //   if (value < 18) {
        //     callback(new Error('必须年满18岁'));
        //   } else {
        //     callback();
        //   }
        // }
        callback();
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        pass: "",
        checkPass: "",
        age: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let that=this;
      this.$refs[formName].validate(valid => {
        if (valid) {
              console.log(this.ruleForm2.age)
          axios
            .post("http://82297834.800.si/login", {
              userName: this.ruleForm2.age,
              password: this.ruleForm2.pass
            })
            .then(function(response) {
              let status=response.data.code;
                if(status==0){
                  let user=JSON.stringify(response.data.data)
                  localStorage.setItem('user',user);
                    that.$router.push('/');
                  }else if(status==1){
                    that.$message.error('密码错误');
                  }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang='scss' scoped>
.login {
  margin: 120px auto;
  padding: 30px;
  max-width: 340px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
