<template>
  <div class="titleText">
    <img src="../assets/images/graduated.png" class="w-10 mr-1" />
    <span>Öğrenci Kartı</span>
  </div>

  <button>
    <router-link class="btn_img mb-4 mr-2" :to="{ name: 'Home' }">
      <img src="../assets/images/arrow-left.png" />
      <span>Geri</span>
    </router-link>
  </button>

  <form @submit.prevent="callFunction">
    <div class="flex">
      <div>
        <p class="tableTitle">Öğrenci Bilgileri</p>
        <h1></h1>
        <table class="text-left mr-5">
          <tr>
            <td>Öğrenci No</td>
            <td><input type="number" v-model.number="student_number" /></td>
          </tr>
          <tr>
            <td>Öğrenci Adı</td>
            <td><input type="text" v-model="first_name" /></td>
          </tr>
          <tr>
            <td>Öğrenci Soyadı</td>
            <td><input type="text" v-model="last_name" /></td>
          </tr>
          <tr>
            <td>TC No</td>
            <td><input type="number" v-model.number="tc_number" /></td>
          </tr>
          <tr>
            <td>Doğ. Tarihi</td>
            <td><input type="date" v-model="birth_date" /></td>
          </tr>
          <tr>
            <td>Durumu</td>
            <td>
              <select v-model="status">
                <option selected>Aktif</option>
                <option>Aktif Değil</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Adres</td>
            <td><input type="text" v-model="address" /></td>
          </tr>
          <tr>
            <td>Cinsiyet</td>
            <td>
              <select v-model="gender">
                <option>Erkek</option>
                <option>Bayan</option>
              </select>
            </td>
          </tr>
        </table>
      </div>

      <div>
        <p class="tableTitle">Nüfus Bilgileri</p>
        <table>
          <tr>
            <td>Sınıfı</td>
            <td><input v-model="grade" type="text" /></td>
          </tr>
          <tr>
            <td>Sınıf Öğretmeni</td>
            <td><input v-model="teacher_name" type="text" /></td>
          </tr>
          <tr>
            <td>Kayıt Tarihi</td>
            <td><input v-model="registration_date" type="date" /></td>
          </tr>
          <tr>
            <td>Okul Türü</td>
            <td><input v-model="education_type" type="text" /></td>
          </tr>
        </table>
      </div>
    </div>

    <br />

    <p class="font-bold text-2xl mb-2">Ücret ve Ödeme Bilgileri</p>

    <div class="flex">
      <!-- Education payments -->
      <div class="mr-5">
        <p class="tableTitle">Eğitim</p>
        <div class="inputContainer">
          <p>Kontrakt Fiyatı</p>
          <input type="text" v-model.number="education_payment.total" />
          <p>$</p>
        </div>

        <table class="styledTable my-3">
          <tr>
            <td></td>
            <td>Ödeme miktarı</td>
            <td>Ödeme tarihi</td>
          </tr>
          <tr
            v-for="(payment, index) in education_payment.payments"
            :key="payment.id"
          >
            <td>{{ index + 1 }}</td>
            <td><input type="text" v-model.number="payment.amount" /></td>
            <td><input type="date" v-model="payment.date" /></td>
            <td
              class="tdActionBtn cursor-pointer"
              @click="
                removePayment(
                  education_payment.payments,
                  'education',
                  payment.id
                )
              "
            >
              <div class="tdActionBtn">
                <img src="../assets/images/remove.png" />
              </div>
            </td>
          </tr>
        </table>

        <button
          type="button"
          class="btn_img"
          @click="addPayment(education_payment.payments, 'education')"
        >
          <img src="../assets/images/add.png" style="margin-right: 5px" />
          <span>Ekle</span>
        </button>

        <p>Kalan Ödeme: {{ education_payment.remaining }}</p>
      </div>
      <!-- Meal payments -->
      <div>
        <p class="tableTitle">Yemek</p>
        <div class="inputContainer">
          <p>Yemek Ucreti</p>
          <input type="text" v-model.number="meal_payment.total" />
          <p>$</p>
        </div>

        <table class="styledTable my-3">
          <tr>
            <td></td>
            <td>Ödeme miktarı</td>
            <td>Ödeme tarihi</td>
          </tr>
          <tr
            v-for="(payment, index) in meal_payment.payments"
            :key="payment.id"
          >
            <td>{{ index + 1 }}</td>
            <td><input type="text" v-model.number="payment.amount" /></td>
            <td><input type="date" v-model="payment.date" /></td>
            <td
              class="tdActionBtn cursor-pointer"
              @click="removePayment(meal_payment.payments, 'meal', payment.id)"
            >
              <div class="tdActionBtn">
                <img src="../assets/images/remove.png" />
              </div>
            </td>
          </tr>
        </table>

        <button
          type="button"
          class="btn_img"
          @click="addPayment(meal_payment.payments, 'meal')"
        >
          <img src="../assets/images/add.png" style="margin-right: 5px" />
          <span>Ekle</span>
        </button>

        <p>Kalan Ödeme: {{ meal_payment.remaining }}</p>
      </div>
    </div>

    <button type="submit" class="btn_img mb-4 mt-3">
      <img src="../assets/images/add_student.png" />
      <span>{{ _isPending ? "Kaydediliyor..." : "Kaydet" }}</span>
    </button>
  </form>
  <p v-if="_error" class="error">Bir şeyler yanlış gitti</p>
</template>

<script>
import useCollection from "../composables/useCollection";
import useDocument from "../composables/useDocument";
import getDocument from "../composables/getDocument";
import { ref, watch, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  props: ["action"],
  setup(props) {
    // About student
    const student_number = ref("");
    const first_name = ref("");
    const last_name = ref("");
    const tc_number = ref("");
    const birth_date = ref("");
    const status = ref("");
    const address = ref("");
    const gender = ref("");

    const grade = ref("");
    const teacher_name = ref("");
    const registration_date = ref("");
    const education_type = ref("");

    // Education Billings
    const education_payment = ref({
      total: 0,
      remaining: 0,
      payments: [],
    });

    // Meal
    const meal_payment = ref({
      total: 0,
      remaining: 0,
      payments: [],
    });

    const calculateRemaining = (payment_type) => {
      let sum = 0;
      for (let payment of payment_type.payments) {
        sum += payment.amount;
      }
      console.log(payment_type.total - sum);
      return payment_type.total - sum;
    };

    watch(() => {
      education_payment.value.remaining = calculateRemaining(
        education_payment.value
      );
      meal_payment.value.remaining = calculateRemaining(meal_payment.value);
    });

    const _error = ref("");
    const _isPending = ref("");

    const router = useRouter();
    const route = useRoute();

    if (props.action == "updateStudent") {
      const { document: student, error } = getDocument(
        "students",
        route.params.id
      );

      watch(student, () => {
        student_number.value = student.value.student_number;
        first_name.value = student.value.first_name;
        last_name.value = student.value.last_name;
        tc_number.value = student.value.tc_number;
        birth_date.value = student.value.birth_date;
        status.value = student.value.status;
        address.value = student.value.address;
        gender.value = student.value.gender;
        grade.value = student.value.grade;
        teacher_name.value = student.value.teacher_name;
        registration_date.value = student.value.registration_date;
        education_type.value = student.value.education_type;
        // Billings
        education_payment.value = student.value.education_payment;
        meal_payment.value = student.value.meal_payment;
      });
    }

    const addPayment = (payments, type) => {
      let newPayments = [
        ...payments,
        {
          id: Date.now(),
          amount: 0,
          date: "",
        },
      ];
      if (type == "education") {
        education_payment.value.payments = newPayments;
      } else if (type == "meal") {
        meal_payment.value.payments = newPayments;
      }
    };

    const removePayment = (payments, type, id) => {
      let filteredPayments = payments.filter((payment) => {
        return payment.id != id;
      });

      if (type == "education") {
        education_payment.value.payments = filteredPayments;
      } else if (type == "meal") {
        meal_payment.value.payments = filteredPayments;
      }
    };

    const callFunction = async () => {
      let changes = {
        student_number: student_number.value,
        first_name: first_name.value,
        last_name: last_name.value,
        tc_number: tc_number.value,
        birth_date: birth_date.value,
        status: status.value,
        address: address.value,
        gender: gender.value,
        createdAt: new Date(),
        grade: grade.value,
        teacher_name: teacher_name.value,
        registration_date: registration_date.value,
        education_type: education_type.value,
        // Billings
        education_payment: education_payment.value,
        meal_payment: meal_payment.value,
      };

      if (props.action == "addStudent") {
        const { addDoc, error, isPending } = useCollection("students");
        if (!isPending.value) {
          await addDoc(changes);
          _error.value = error.value;
          _isPending.value = isPending.value;
        }
      } else if (props.action == "updateStudent") {
        const { updateDoc, error, isPending } = useDocument(
          "students",
          route.params.id
        );
        if (!isPending.value) {
          await updateDoc(changes);
          _error.value = error.value;
          _isPending.value = isPending.value;
        }
      }

      if (!_error.value) {
        router.push({ name: "Home" });
      }
    };

    return {
      student_number,
      first_name,
      last_name,
      tc_number,
      birth_date,
      status,
      address,
      gender,
      _error,
      _isPending,
      grade,
      teacher_name,
      registration_date,
      education_type,
      callFunction,
      education_payment,
      meal_payment,
      addPayment,
      removePayment,
    };
  },
};
</script>

<style scoped>
tr td:first-child {
  @apply pr-4;
}
</style>
