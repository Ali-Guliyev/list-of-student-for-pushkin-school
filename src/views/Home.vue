<template>
  <div class="titleText">
    <img src="../assets/images/graduated.png" class="w-10 mr-1" />
    <span>Öğrenci listesi</span>
  </div>

  <button>
    <router-link class="btn_img" :to="{ name: 'AddStudent' }">
      <img src="../assets/images/add_student.png" />
      <span>Yeni Kayıt</span>
    </router-link>
  </button>

  <div>
    <input
      class="mt-2 mr-1"
      type="text"
      placeholder="Arama İçin Metin Giriiniz..."
      v-model="query"
    />
  </div>

  <table v-if="students" class="styledTable mt-3">
    <tr>
      <th v-if="students.length"></th>
      <th>Öğr.No</th>
      <th>TC No</th>
      <th>Adı</th>
      <th>Soyadı</th>
      <th>Cinsiyeti</th>
      <th>Sınıfı</th>
      <th>Sınıf Öğretmeni</th>
      <th>Durumu</th>
      <th>Kayıt Tarihi</th>
      <th>Okul Türü</th>
    </tr>

    <tr v-for="(student, i) in filteredStudents()" :key="student.id">
      <td class="w-14">{{ i + 1 }}</td>
      <td>{{ student.student_number }}</td>
      <td>{{ student.tc_number }}</td>
      <td>{{ student.first_name }}</td>
      <td>{{ student.last_name }}</td>
      <td>{{ student.gender }}</td>
      <td>{{ student.grade }}</td>
      <td>{{ student.teacher_name }}</td>
      <td>{{ student.status }}</td>
      <td>{{ student.registration_date }}</td>
      <td>{{ student.education_type }}</td>
      <td class="tdActionBtn">
        <router-link :to="{ name: 'StudentInfo', params: { id: student.id } }">
          <div class="tdActionBtn">
            <img src="../assets/images/edit.png" />
          </div>
        </router-link>
      </td>
      <td class="tdActionBtn cursor-pointer" @click="removeStudent(student.id)">
        <div class="tdActionBtn">
          <img src="../assets/images/remove.png" />
        </div>
      </td>
    </tr>
  </table>
  <div v-else>
    <span class="text-xl">Yükleniyor...</span>
  </div>
  <p class="error" v-if="collectionError">Bir şeyler yanlış gitti</p>
</template>

<script>
import { ref } from "vue";
import getCollection from "../composables/getCollection";
import useDocument from "../composables/useDocument";
export default {
  setup() {
    const { documents: students, error: collectionError } = getCollection(
      "students",
      "createdAt"
    );
    const query = ref("");

    const removeStudent = async (id) => {
      const { deleteDoc } = useDocument("students", id);
      await deleteDoc();
    };

    const filteredStudents = () => {
      return students.value.filter((student) => {
        return student.first_name.includes(query.value);
      });
    };

    return {
      removeStudent,
      students,
      collectionError,
      query,
      filteredStudents,
    };
  },
};
</script>
