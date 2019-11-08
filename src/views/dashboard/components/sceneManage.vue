<template>
  <div class="scene scene-rename">
    <div class="scene-header">
      <svg-icon icon-class="v_houses" class-name="scene-house" />
      <span class="scene-titile">{{ houseInf.name }}</span>
    </div>
    <div class="scene-content">
      <img class="scene-image" src="../../../assets/partment.jpg" alt />
      <p class="scene-num">楼栋数: {{ count }}</p>
      <p class="scene-num">区域: {{ area }}</p>
      <p class="scene-num">地址: {{ houseInf.address }}</p>
    </div>
  </div>
</template>

<script>
// import { getLocInf, getLocation } from "@/api/statistics";
// import { getHouseList } from "@/api/houseList";
export default {
  data() {
    return {
      houseInf: { name: "一石数字", address: "盛邦街" },
      count: 0,
      area: "..............."
    };
  },
  created() {
    // this.getSceneInf();
    // this.fetchHouseList();
  },
  methods: {
    // 获取场景信息
    // async getSceneInf() {
    //   const { data } = await getLocInf();
    //   // 反查出地址
    //   this.houseInf = data;
    //   const dataLoc = await getLocation(this.houseInf.loc);
    //   this.area = dataLoc.data;
    // },
    // // 获取楼栋数
    // async fetchHouseList() {
    //   const { data } = await getHouseList();
    //   this.count = data.count;
    // }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$size: 24px;
$wa: #ffa726;
$la: #26c6da;
$lv: #66bb6a;
$block: inline-block;
.scene {
  height: 290px;
  border: solid 1px #e6e6e6;
  background: #fff;
  margin-bottom: 20px;
}
.scene-header {
  padding: 10px 10px 2px 10px;
  border-bottom: solid 1px #e6e6e6;
}
.scene-house {
  font-size: 26px;
  margin-right: 4px;
}
.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}

.scene-content {
  padding: 10px 10px 2px 10px;
}
.scene-image {
  width: 100%;
  height: 145px;
  margin-bottom: 10px;
}
.scene-num {
  font-size: 15px;
  color: #474758;
  margin-bottom: 4px;
  // line-height: 26px;
}
</style>
