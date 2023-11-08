<template>
<div class="fight-field">
  <div class="pokemon-info">
    <div class="pokemon-info-image">
      <img v-if="fightStore.user_pokemon !== undefined" :src="fightStore.user_pokemon.sprites.front_default" :alt="fightStore.user_pokemon.name"/>
    </div>
    <div class="pokemon-info-name" v-if="fightStore.user_pokemon !== undefined">
      {{ fightStore.user_pokemon?.name }}
    </div>
    <div class="pokemon-stats" v-if="fightStore.user_pokemon != undefined">
      <div v-for="stat in fightStore.user_pokemon.stats" :key="stat.stat.name" class="pokemon-stat">
        <div class="pokemon-stat-name">{{ stat.stat.name }}</div>
        <div class="pokemon-stat-value">{{ stat.base_stat }}</div>
      </div>
    </div>
  </div>
  <div class="fight-actions">
    <input v-if="fightStore.someoneIsAlive && !isAutoFight" class="user-number-input" type="number" v-model="user_number">
    <button v-if="fightStore.someoneIsAlive && !isAutoFight" @click="attack" class="button-action" :disabled="isAttacking">Attack!</button>
    <span class="attack_result">
      {{ attack_result }}
    </span>

    <input v-if="!fightStore.someoneIsAlive" class="user-number-input email-input" type="email" v-model="email">
    <button v-if="!fightStore.someoneIsAlive" @click="sendMail" class="button-action">Send mail report!</button>
  </div>
  <div class="pokemon-info">
    <div class="pokemon-info-image">
      <img v-if="fightStore.opponent_pokemon !== undefined" :src="fightStore.opponent_pokemon.sprites.front_default" :alt="fightStore.opponent_pokemon.name"/>
    </div>
    <div class="pokemon-info-name" v-if="fightStore.opponent_pokemon !== undefined">
      {{ fightStore.opponent_pokemon?.name }}
    </div>
    <div class="pokemon-stats" v-if="fightStore.opponent_pokemon != undefined">
      <div v-for="stat in fightStore.opponent_pokemon.stats" :key="stat.stat.name" class="pokemon-stat">
        <div class="pokemon-stat-name">{{ stat.stat.name }}</div>
        <div class="pokemon-stat-value">{{ stat.base_stat }}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {useFightStore} from "@/stores/fight";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const fightStore = useFightStore();
const user_number = ref<number>();
const attack_result = ref<string>();
const isAttacking = ref<boolean>(false);
const attack = () => {
  isAttacking.value = true;
  attack_result.value = "Проведение атаки...";
  setTimeout(async () => {
    attack_result.value = await fightStore.attack(user_number.value);
    isAttacking.value = false;
  }, 2000)
}

const isAutoFight = ref<boolean>(false);
const autoFight = () => {
  isAutoFight.value = true;
  attack_result.value = "Готовсь к бою...";

  const interval = setInterval(async () => {
    if (fightStore.someoneIsAlive) {
      attack_result.value = await fightStore.attack();
    } else {
      clearInterval(interval);
    }
  }, 2000)
}

const email = ref<string>("");
const sendMail = async () => {
  await fightStore.sendLogsToMail(email.value);
}

const route = useRoute();
onMounted(() => {
  if (route.query.auto === "true") {
    autoFight();
  }
})
</script>

<style lang="scss" scoped>
.fight-field {
  display: flex;
  justify-content: center;
  align-items: center;

  .fight-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 50px;
    margin-right: 50px;
    width: 150px;
    max-width: 150px;

    .user-number-input {
      width: 100px;
      height: 40px;
      border-radius: 40px;
      outline: none;
      border: 1px solid #d5d5d5;
      padding-left: 15px;
      padding-right: 15px;
      font-size: 16px;
      font-weight: 500;
    }

    .button-action {
      width: 200px;
      height: 40px;
      margin-top: 20px;
      border-radius: 40px;
      outline: none;
      border: 1px solid #d5d5d5;
      background-color: #f5f5f5;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      &:hover {
        background-color: #e5e5e5;
      }
    }

    .attack_result {
      font-size: 16px;
      font-weight: 500;
      margin-top: 20px;
      color: #4a4a4a;
    }

    .email-input {
      margin-top: 20px;
      width: 200px;
    }
  }

  .pokemon-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    margin-bottom: 30px;
    border: 1px solid #d5d5d5;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }

    .pokemon-info-image {
      width: 200px;
      height: 200px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .pokemon-info-name {
      font-size: 20px;
      font-weight: 500;
      margin-top: 10px;
      color: #4a4a4a;
    }

    .pokemon-stats {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 20px;

      .pokemon-stat {
        display: flex;
        justify-content: space-between;
        width: 200px;
        margin-bottom: 10px;

        .pokemon-stat-name {
          font-size: 16px;
          font-weight: 500;
          color: #4a4a4a;
        }

        .pokemon-stat-value {
          font-size: 16px;
          font-weight: 500;
          color: #4a4a4a;
        }
      }
    }
  }
}
</style>