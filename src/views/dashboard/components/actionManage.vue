<template>
  <div class="pass">
    <div class="fun-data">
      <div
        class="data-statistics"
        v-for="(item, index) in routes"

        :key="index"
      >
        <div class="fun-title"
        v-if="!item.hidden && item.children">
          <router-link v-if="item.meta && item.meta.title" :to="item.redirect">
            <div class="item group-rename">
              <svg-icon
                v-if="item.meta && item.meta.icon"
                :icon-class="item.meta.icon"
                :class-name="item.meta.icon_class"
                style="margin-right:0;"
              ></svg-icon>
              <p class="item-text" v-if="item.meta && item.meta.title">
                {{ item.meta.title }}
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    routes() {
      return this.$router.options.routes;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$size: 24px;
$wa: #ffa726;
$la: #26c6da;
$lv: #66bb6a;
$block: inline-block;
p {
  margin: 5px;
}
.scene-house {
  font-size: 26px;
  margin-right: 4px;
}
.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}
// ??
$person: #e08348;
$personA: RGB(141, 168, 201);
$personB: RGB(115, 198, 180);
$personC: RGB(132, 110, 97);
$personD: RGB(218, 89, 107);
$personE: RGB(175, 133, 147);
$car: RGB(86, 82, 132);
$carA: RGB(223, 128, 86);
$carB: RGB(237, 202, 134);
$query: #e3676c;
$queryA: #be5c75;
$queryB: #7f7dae;
$queryC: #798384;
$mesage: #7d5c5b;
$mesageA: #64a4ae;
$help: #009bba;
$helpA: #807869;
$helpB: #cc8d64;
$size: 78px;
$padding: 17px;
$color: #ffffff;
.fun-data {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  padding: 17px 10px 5px 10px;

}
.data-statistics {
  // width: 456px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  // position: relative;
}
.fun-title {
  font-size: 14px;
  white-space: nowrap;
  // position: absolute;
  // left: 0px;
}

.item-text {
  font-size: 17px;
  line-height: 68px;
  margin-left: 20px;
}
// 异常数据
.person-icon {
  font-size: 100px;
  color: $person;
  padding: 10px;
}
.person-iconA {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $personA;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.person-iconB {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $personB;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.person-iconC {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $personC;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.person-iconD {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $personD;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.person-iconE {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $personE;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}

.car-manage {
  font-size: 100px;
  color: $car;
  padding: 10px;
}

.car-iconA {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $carA;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}

.car-iconB {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $carB;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}

.help {
  font-size: 100px;
  color: $help;
  padding: 10px;
}

.help-iconA {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $helpA;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}

.help-iconB {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $helpB;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.data-query {
  font-size: 100px;
  color: $query;
  padding: 10px;
}
.query-iconA {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $queryA;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.query-iconB {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $queryB;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}

.query-iconC {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $queryC;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.data-mesage {
  font-size: 100px;
  color: $mesage;
  padding: 10px;
}
.mesage-iconA {
  font-size: $size;
  padding: $padding;
  color: $color;
  background: $mesageA;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.statistics-item {
  display: flex;
  margin-top: 16px;
  // position: relative;
  // left: -60px;
}
.item {
  font-size: 14px;
  display: flex;
  border: 1px solid #e6e6e6;
  padding: 0 15px 0 0;
  background: #f9f9f9;
  margin: 5px 21px;
  border-radius: 6px;
  background: #fff;
}
.car-list {
  position: relative;
}
.choose-car {
  width: 104px;
  border: 1px solid #e6e6e6;
  position: absolute;
  top: 41px;
  left: 5px;
  z-index: 999;
}
.choose-item {
  text-align: center;
  line-height: 28px;
  font-size: 14px;
  color: #409eff;
  background: #ecf5ff;
  border-bottom: 1px solid #b3d8ff;
  // border-color: #b3d8ff;
}
.choose-item:hover {
  background: #409eff;
  color: #fff;
}
</style>
