<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader
          ref="actionHeader"
          :btnStatus="1"
          :moreStatus="false"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
        >
          <!-- <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>进出次数排序</el-dropdown-item>
            <el-dropdown-item>滞留时间排序</el-dropdown-item>
            <el-dropdown-item>次数统计</el-dropdown-item>
          </el-dropdown-menu>-->
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓名:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.name"
                placeholder="请输入关注人姓名"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name filter-rewrite">预警组别:</span>
              <el-select
                class="select-class"
                v-model="filterForm.earlyGroupId"
                size="small"
                placeholder="请选择预警组别"
              >
                <el-option
                  v-for="tag in earlyGroup"
                  :key="tag.id"
                  :label="tag.groupName"
                  :value="tag.id"
                ></el-option>
              </el-select>
            </div>
            <div class="word-filter">
              <span class="filter-name">紧急电话:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.emergencyPhone"
                placeholder="请输入手机号码"
                clearable
                @keyup.enter.native="emitFetchData"
                @keyup.native="filterNumber"
                @keydown.native="filterNumber"
              ></el-input>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="rightContent">
          <el-table
            height="65vh"
            v-loading="showLoading"
            :data="list_data"
            stripe
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column v-if="globalUpdateStatus" type="selection" width="50" disabled="true"></el-table-column>

            <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <div @click="editTarget(scope.row)">
                        <el-dropdown-item command="update">修改</el-dropdown-item>
                      </div>
                      <el-dropdown-item
                        :command="returnCommand('delete', scope.row)"
                      >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              label="姓名"
              width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-button
                  @click="showCarDetails(scope.row,'first')"
                  type="text"
                  class="serial-num"
                >{{scope.row.name}}</el-button>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="age" align="center" label="年龄" :show-overflow-tooltip="true"></el-table-column> -->

            <el-table-column
              prop="typeName"
              align="center"
              label="分类"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column prop="phone" align="center" label="联系电话" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column
              prop="locationName"
              align="center"
              label="房屋编号"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{scope.row.house&&scope.row.house.length>0 ? scope.row.house[0].locationName :'--'}}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="emergencyPhone"
              align="center"
              label="紧急电话"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="earlyGroupName"
              align="center"
              label="预警组别"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-button
                  @click="showCarDetails(scope.row,'second')"
                  type="text"
                  class="serial-num"
                >{{scope.row.earlyGroupName}}</el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="earlyPeriod"
              align="center"
              label="预警周期"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column align="center" label="状态" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px;"
                  :type="scope.row.isNormal ? 'success' : 'danger'"
                >{{ scope.row.isNormal? "正常" : "异常" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="note" align="center" label="备注" :show-overflow-tooltip="true">
              <template slot-scope="{row}">
                <p
                  class="rowUpdate"
                  v-show="!row.noteStatus || editForm.id !== row.id"
                  @click="editNote(row)"
                >{{ row.note ? row.note :'--'}}</p>
                <el-input
                  :ref="row.id"
                  v-show="row.noteStatus&&editForm.id === row.id"
                  size="mini"
                  clearable
                  :maxlength="200"
                  v-model="editForm.note"
                  placeholder="输入备注"
                  @keyup.enter.native="noteBlur(row,'2')"
                  @input="constraintLength(editForm.note,'200')"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          @current-change="pageChange"
          style="margin-top:10px;"
          background
          layout="prev, pager, next,total"
          :page-size="page.limit"
          :total="page.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 添加关注人员 -->
    <el-dialog
      title="添加"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="createForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
        style="margin-right:40px;"
      >
        <el-form-item
          label="姓名:"
          prop="scenceUser"
          :show-message="showMessage"
          :error="errorMessage.scenceUser"
        >
          <el-select
            style="width:100%"
            v-model="createForm.scenceUser"
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            placeholder="请输入姓名进行模糊查询"
          >
            <el-option
              v-for="item in nameList"
              :key="item.scenceUserId"
              :label="item.name"
              :value="[item.scenceUserId,item.name]"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item. value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!--
        <div style="display: flex;">
          <el-form-item
            class="ei-input-rewrite"
            label="年龄:"
            prop="age"
            :show-message="showMessage"
            :error="errorMessage.age"
          >
            <el-input
              autocomplete="off"
              placeholder="请输入年龄"
              min="0"
              maxlength="3"
              clearable
              v-model="createForm.age"
              @keyup.native="ageNumber"
              @keydown.native="ageNumber"
            ></el-input>
          </el-form-item>
          <p class="ei-input-hint">岁</p>
        </div>-->

        <!-- <div style="display: flex;"> -->
        <el-form-item
          label="紧急电话:"
          prop="emergencyPhone"
          :show-message="showMessage"
          :error="errorMessage.emergencyPhone"
        >
          <el-input
            class="phone-position"
            v-model="createForm.emergencyPhone"
            placeholder="请输入手机号码"
            clearable
            :maxlength="11"
            @keyup.native="UpNumber"
            @keydown.native="UpNumber"
            @change="clearableBtn"
            @input="hint"
            @focus="hintFocus"
            @blur="hintBlur"
            @mouseover.native="hint(createForm.emergencyPhone)"
            @mouseout.native="hint(createForm.emergencyPhone)"
          ></el-input>
          <span v-show="hintPhone" class="ei-input-hint">{{phoneNum}}/11</span>
        </el-form-item>
        <!-- </div> -->

        <!-- <div style="display: flex;"> -->
        <el-form-item
          label="预警周期:"
          prop="earlyPeriod"
          :show-message="showMessage"
          :error="errorMessage.earlyPeriod"
        >
          <el-input
            v-model="createForm.earlyPeriod"
            autocomplete="off"
            placeholder="预警周期 如: 3 天"
            min="0"
            maxlength="10"
            clearable
            @keydown.native="earlyPeriodNumber"
            @keyup.native="earlyPeriodNumber"
          ></el-input>
        </el-form-item>
        <!-- <p class="ei-input-hint">天</p> -->
        <!-- </div> -->

        <el-form-item
          label="预警组别:"
          prop="earlyGroupId"
          :show-message="showMessage"
          :error="errorMessage.earlyGroupId"
        >
          <el-select style="width:100%" v-model="createForm.earlyGroupId" placeholder="请选择预警组别">
            <el-option
              v-for="tag in earlyGroup"
              :key="tag.id"
              :label="tag.groupName"
              :value="tag.id"
            ></el-option>
          </el-select>
          <!-- <el-button @click="showTypeSetting = !showTypeSetting">添加分组</el-button> -->
          <!-- <div v-if="showTypeSetting">
            <el-tag
              style="margin-left:5px"
              :key="index"
              v-for="(tag, index) in earlyGroup"
              closable
              :disable-transitions="false"
              @close="deleteTag(tag, index,'group')"
            >{{tag.groupName}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="newTag"
              v-model="newTagValue"
              :maxlength="10"
              clearable
              ref="saveTagInput"
              size="small"
              placeholder="请输入添加分组名称"
              @input="constraintLength(newTagValue,'10')"
              @blur="handleInputConfirm('group')"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput('group')">添加分组</el-button>
          </div>-->
        </el-form-item>

        <el-form-item
          label="人员类别:"
          prop="typeId"
          :show-message="showMessage"
          :error="errorMessage.typeId"
        >
          <div style="display: flex;flex-wrap: nowrap;justify-content: space-between;">
            <el-select style="width:100%" v-model="createForm.typeId" placeholder="请选择人员类别">
              <el-option
                v-for="tag in earlyType"
                :key="tag.id"
                :label="tag.typeName"
                :value="tag.id"
              ></el-option>
            </el-select>
            <el-button style="margin-left:5px" @click="showUnitSetting = !showUnitSetting">添加类别</el-button>
          </div>

          <div v-if="showUnitSetting">
            <el-tag
              style="margin-left:5px"
              :key="index"
              v-for="(tag, index) in earlyType"
              closable
              :disable-transitions="false"
              @close="deleteTag(tag, index,'type')"
            >{{tag.typeName}}</el-tag>
            <el-input
              class="input-new-tag"
              clearable
              v-if="newTypeTag"
              v-model="newTypeTagValue"
              ref="saveTagInput"
              size="small"
              placeholder="请输入添加类别名称"
              :maxlength="10"
              @input="constraintLength(newTagValue,'10')"
              @blur="handleInputConfirm('type')"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput('type')">添加类别</el-button>
          </div>
        </el-form-item>

        <el-form-item
          label="备注信息:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            v-model="createForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            clearable
            type="textarea"
            @input="constraintLength(createForm.note,'200')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createFocusPeople">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改关注人员 -->
    <el-dialog
      title="修改"
      :visible.sync="dialogEdit"
      width="500px"
      :before-close="editClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="updateForm"
        :model="editForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
        style="margin-right:40px;"
      >
        <!-- <el-form-item label="姓名:" :show-message="showMessage" :error="errorMessage.scenceUser">
          <el-select
            style="width:100%"
            v-model="editForm.name"
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            placeholder="请输入姓名进行模糊查询"
          >
            <el-option
              v-for="item in nameList"
              :key="item.scenceUserId"
              :label="item.name"
              :value="[item.scenceUserId,item.name]"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item. value }}</span>
            </el-option>
          </el-select>
        </el-form-item>-->
        <!-- <div style="display: flex;">
          <el-form-item
            class="ei-input-rewrite"
            label="年龄:"
            prop="age"
            :show-message="showMessage"
            :error="errorMessage.age"
          >
            <el-input
              autocomplete="off"
              placeholder="输入年龄"
              min="0"
              maxlength="3"
              clearable
              v-model="editForm.age"
              @keyup.native="ageNumber"
              @keydown.native="ageNumber"
            ></el-input>
          </el-form-item>
          <p class="ei-input-hint">岁</p>
        </div>-->

        <!-- <div style="display: flex;"> -->
        <el-form-item
          label="紧急电话:"
          prop="editEmergencyPhone"
          :show-message="showMessage"
          :error="errorMessage.editEmergencyPhone"
        >
          <el-input
            class="phone-position"
            v-model="editForm.emergencyPhone"
            placeholder="请输入紧急联系人电话"
            :maxlength="11"
            clearable
            @keyup.native="UpNumber"
            @keydown.native="UpNumber"
            @change="clearableBtn"
            @input="hint"
            @focus="hintFocus"
            @blur="hintBlur"
            @mouseover.native="hint(createForm.emergencyPhone)"
            @mouseout.native="hint(createForm.emergencyPhone)"
          ></el-input>
          <span v-show="hintPhone" class="ei-input-hint">{{phoneNum}}/11</span>
        </el-form-item>
        <!-- </div> -->

        <!-- <div style="display: flex;"> -->
        <el-form-item label="预警周期:" :show-message="showMessage" :error="errorMessage.earlyPeriod">
          <el-input
            v-model.number="editForm.earlyPeriod"
            autocomplete="off"
            placeholder="预警周期 如: 3 天"
            min="0"
            maxlength="10"
            clearable
            @keydown.native="earlyPeriodNumber"
            @keyup.native="earlyPeriodNumber"
          ></el-input>
        </el-form-item>
        <!-- <p class="ei-input-hint">天</p> -->
        <!-- </div> -->

        <el-form-item
          label="预警组别:"
          prop="earlyGroupId"
          :show-message="showMessage"
          :error="errorMessage.earlyGroupId"
        >
          <el-select style="width:100%" v-model="editForm.earlyGroupId" placeholder="请选择预警组别">
            <el-option
              v-for="tag in earlyGroup"
              :key="tag.id"
              :label="tag.groupName"
              :value="tag.id"
            ></el-option>
          </el-select>
          <!-- <el-button @click="showTypeSetting = !showTypeSetting">添加分组</el-button>
          <div v-if="showTypeSetting">
            <el-tag
              style="margin-left:5px"
              :key="index"
              v-for="(tag, index) in earlyGroup"
              closable
              :disable-transitions="false"
              @close="deleteTag(tag, index,'group')"
            >{{tag.groupName}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="newTag"
              v-model="newTagValue"
              ref="saveTagInput"
              size="small"
              :maxlength="10"
              clearable
              placeholder="请输入添加分组名称"
              @input="constraintLength(newTagValue,'10')"
              @blur="handleInputConfirm('group')"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput('group')">添加分组</el-button>
          </div>-->
        </el-form-item>

        <el-form-item
          label="人员类别:"
          prop="typeId"
          :show-message="showMessage"
          :error="errorMessage.typeId"
        >
          <div style="display: flex;flex-wrap: nowrap;justify-content: space-between;">
            <el-select style="width:100%" v-model="editForm.typeId" placeholder="请选择">
              <el-option
                v-for="tag in earlyType"
                :key="tag.id"
                :label="tag.typeName"
                :value="tag.id"
              ></el-option>
            </el-select>
            <el-button style="margin-left:5px" @click="showUnitSetting = !showUnitSetting">添加类别</el-button>
          </div>

          <div v-if="showUnitSetting">
            <el-tag
              style="margin-left:5px"
              :key="index"
              v-for="(tag, index) in earlyType"
              closable
              :disable-transitions="false"
              @close="deleteTag(tag, index,'type')"
            >{{tag.typeName}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="newTypeTag"
              v-model="newTypeTagValue"
              ref="saveTagInput"
              size="small"
              placeholder="请输入添加类别名称"
              :maxlength="10"
              clearable
              @input="constraintLength(newTypeTagValue,'10')"
              @blur="handleInputConfirm('type')"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput('type')">添加类别</el-button>
          </div>
        </el-form-item>

        <el-form-item
          label="备注信息:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            v-model="editForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            type="textarea"
            clearable
            @input="constraintLength(editForm.note,'200')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClose">取 消</el-button>
        <el-button type="primary" @click="updateFocusPeople">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 目标详情 -->
    <el-dialog
      top="5vh"
      class="dialog-rewrite"
      title="人员详情"
      :visible.sync="detailDialogVisible"
      :before-close="closeBtn"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="人员信息" name="first">
          <el-form label-width="130px" :model="userDetail">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="姓名:">
                  <span>{{userDetail.name ? userDetail.name :'--'}}</span>
                </el-form-item>
                <!-- <el-form-item style="margin-bottom:0" label="年龄:">
                  <span>{{userDetail.age ? userDetail.age : '--'}}</span>
                </el-form-item>-->
                <el-form-item style="margin-bottom:0" label="性别:">
                  <span>{{userDetail.sex ? userDetail.sex :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="电话:">
                  <span>{{userDetail.phone ? userDetail.phone:'--'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="身份证号:">
                  <span>{{userDetail.cardNo ? userDetail.cardNo :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{userDetail.note ? userDetail.note :'暂无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="预警组别" name="second">
          <el-table v-loading="earlyLoading" :data="earlyList" style="width: 100%" stripe>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="name" align="center" label="姓名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="phone" align="center" label="电话" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="email" align="center" label="邮箱" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              prop="groupName"
              align="center"
              label="分组"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="note" align="center" label="备注" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          <el-pagination
            background
            style="margin:10px 0"
            @current-change="handleCurrentChangeEarly"
            :page-size="listEarlyQuery.limit"
            :current-page="listEarlyQuery.page"
            layout="total, prev, pager, next, slot"
            :total="listEarlyQuery.total"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="通行记录" name="thirdly">
          <el-table v-loading="passTarget" :data="passList" style="width: 100%" stripe>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column align="center" prop="name" label="姓名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              align="center"
              prop="devAddress"
              label="通行地址"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">{{scope.row.devAddress}} - {{scope.row.devSubAddress}}</template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="passTime"
              label="通行时间"
              width="150px"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column align="center" prop="inOut" label="通行类型" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;"
                  :type="scope.row.inOut==='进'? 'success' : 'danger'"
                >{{ scope.row.inOut}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="抓拍图片">
              <template slot-scope="scope">
                <img :src="scope.row.photos" alt />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            style="margin:10px 0"
            @current-change="handleCurrentChangePass"
            :page-size="listQuery.limit"
            :current-page="listQuery.page"
            layout="total, prev, pager, next, slot"
            :total="listQuery.total"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import {
  addFocusPeople, //添加关注人员
  editFocusPeople, //修改关注人员
  deleteFocusPeople, //删除关注人员
  getType, //获取关注人员类别
  addType, //添加关注人员类别
  deleteType, //删除关注人员类别
  getUserPass //获取目标通行记录
} from "@/api/peopleApi.ts";
import {
  getWarning, //查询预警联系人
  getGroup, //获取关注人员分组
  addGroup, //添加关注人员分组
  deleteGroup //删除关注人员分组
} from "@/api/systemApi.ts";
import { getUserName } from "@/api/vistorApi.ts"; //输入人名模糊查询人员
import { getOwnerUser } from "@/api/carApi.ts"; //获取目标关注人员信息
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class FocusPeople extends Vue {
  filterForm: object = { name: "", emergencyPhone: "", earlyGroupId: "" }; //根据关键字查询
  initForm: object = {
    //获取关注人员列表url
    url: "/admin/usr-focus-personnel/",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-focus-personnel/batch-delete/",
    method: "delete",
    data: []
  };

  private createForm: Object = {
    //添加表单字段
    scenceUser: [], //用户id
    // age: "", //年龄
    earlyGroupId: "", //预警组别
    emergencyPhone: "", // 紧急联系人电话
    earlyPeriod: "", //预警周期
    typeId: "", //人员类别
    note: "" //备注
  };
  private rules: Object = {
    // 表单验证
    scenceUser: [
      { required: true, message: "请输入关注人员姓名", trigger: "blur" }
    ],
    emergencyPhone: [
      { required: true, message: "请输入紧急联系人电话", trigger: "blur" }
    ],
    editEmergencyPhone: [
      { required: false, message: "请输入紧急联系人电话", trigger: "blur" }
    ],
    // age: [{ required: false }, { type: "number", message: "年龄必须为数值" }],
    earlyGroupId: [
      { required: true, message: "请选择预警组别", trigger: "blur" }
    ],
    earlyPeriod: [
      { required: true, message: "请输入预警周期", trigger: "blur" }
    ],
    typeId: [{ required: true, message: "请选择人员类别", trigger: "blur" }]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    phone: "",
    scenceUser: "",
    email: "",
    earlyGroupId: "",
    note: ""
    // age: ""
  };
  private nameList: Array<Object> = []; //人员
  private loading: Boolean = false; //姓名模糊查询

  showUnitSetting: boolean = false; // 查看已有分组设置状态
  earlyGroup: Array<Object> = []; //获取分组
  newTag: boolean = false; // 添加分组框状态
  newTagValue: string = ""; // 添加分组的值

  showTypeSetting: boolean = false; // 查看已有类别设置状态
  earlyType: Array<Object> = []; //获取类别
  newTypeTag: boolean = false; // 添加类别框状态
  newTypeTagValue: string = ""; // 添加类别的值

  private dialogEdit: Boolean = false; // 修改弹出表单
  private editForm: Object = {
    //修改表单字段
    name: "", //姓名
    // age: "", //年龄
    earlyGroupId: "", //预警组别
    emergencyPhone: "", // 紧急联系人电话
    earlyPeriod: 0, //预警周期
    typeId: "", //人员类别
    note: "", //备注
    id: "" //目标关注人员id
  };
  updateArray: Array<string> = ["noteStatus"];

  private detailDialogVisible: boolean = false; // 详细信息dialog弹框
  private CarDialogForm: Object = {}; // 关注人员详细信息
  private activeName: string = "first"; //目标关注人员详细信息 tab Title
  private passTarget: Boolean = true; //目标关注人员通行记录的loadding
  private passList: Array<Object> = []; // 关注人员名单目标通行记录
  private userDetail: Object = {}; //关注人员详细信息
  private earlyList: Array<Object> = []; //预警组别详信息
  private earlyLoading: Boolean = true; //预警组别表格loading
  private noteRewrite: String = ""; //保存未改变的note

  private listQuery: Object = {
    // 关注人员目标通行记录翻页
    total: 0,
    limit: 10,
    page: 1
  };

  private listEarlyQuery: Object = {
    // 关注人员预警组别翻页
    total: 0,
    limit: 10,
    page: 1
  };

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.getGroupList();
    this.getTypeList();
  }

  async remoteMethod(query) {
    /**@description 根据姓名模糊查询人员 */
    if (query !== "") {
      this.loading = true;
      setTimeout(() => {
        if (query.length >= 1) {
          this.getName(query);
        }
      }, 200);
    } else {
      this.nameList = [];
    }
  }

  getName(query) {
    /**@description 获取人员信息 */
    getUserName({ name: query }).then(res => {
      this.loading = false;
      this.nameList = res.data.data.map(item => {
        return {
          value: item.phone,
          name: item.name,
          scenceUserId: item.id
        };
      });
    });
  }

  async getGroupList() {
    /**@description 获取预警组别信息 */
    const { data } = await getGroup();
    // this.createForm["earlyGroupId"] = data.data[0].id;
    this.earlyGroup = data.data;
  }

  async getTypeList() {
    /**@description 获取类别信息 */
    const { data } = await getType();
    // this.createForm["typeId"] = data.data[0].id;
    this.earlyType = data.data;
  }

  showInput(val) {
    /**@description 显示添加预警组别框*/
    val === "group" ? (this.newTag = true) : (this.newTypeTag = true);
  }

  handleInputConfirm(val) {
    /**@description 添加预警组别 */
    if (val === "group") {
      this.newTag = false;
      if (this.newTagValue) {
        addGroup({ groupName: this.newTagValue }).then(res => {
          if (res.data.code === 200) {
            this.getGroupList();
            this.newTagValue = "";
          }
        });
      }
    } else {
      this.newTypeTag = false;
      if (this.newTypeTagValue) {
        addType({ typeName: this.newTypeTagValue }).then(res => {
          if (res.data.code === 200) {
            this.getTypeList();
            this.newTypeTagValue = "";
          }
        });
      }
    }
  }

  deleteTag(tag, index, val) {
    /**@description 删除预警组别 */
    if (val === "group") {
      deleteGroup(tag.id).then(res => {
        if (res.data.code === 200) {
          this.getGroupList();
        }
      });
    } else {
      deleteType(tag.id).then(res => {
        if (res.data.code === 200) {
          this.getTypeList();
        }
      });
    }
  }

  verification(queryString, key) {
    /**@description 验证*/
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数

    if (queryString === "" && key === "emergencyPhone") {
      this.errorMessage[key] = "电话不能为空";
    } else if (queryString === "" && key === "editEmergencyPhone") {
      this.editForm["emergencyPhone"] = null;
    } else if (!regPos.test(queryString)) {
      this.errorMessage[key] = "电话必须是数值";
    } else if (queryString.length > 11) {
      this.errorMessage[key] = "电话号码最多11位";
    } else if (queryString.length < 11) {
      this.errorMessage[key] = "电话号码为11位";
    } else {
      this.errorMessage[key] = "";
    }
  }

  createFocusPeople() {
    /**@description 添加关注人员 */
    // this.verification(this.createForm["emergencyPhone"], "emergencyPhone");
    // if (this.createForm["age"] === "") {
    //   this.createForm["age"] = null;
    // }
    // if (
    //   this.errorMessage["emergencyPhone"] === "" &&
    //   this.createForm["emergencyPhone"].length === 11
    // ) {
    //   if (this.createForm["scenceUser"].length > 0) {
    this.$refs["dataForm"]["validate"](valid => {
      if (valid) {
        var form = {
          ...this.createForm,
          scenceUserId: this.createForm["scenceUser"][0],
          name: this.createForm["scenceUser"][1]
        };
        delete form["scenceUser"];
        // form["earlyPeriod"] = Number(form["earlyPeriod"]);
        addFocusPeople(form).then(res => {
          this.handleClose();
          this["fetchData"](this.initForm);
          this["notify"]("success", "成功", "添加关注人员成功");
        });
      }
    });
    //   } else {
    //     this.errorMessage["scenceUser"] = "姓名不能为空";
    //   }
    // } else {
    //   this["message"]("请输入正确的电话号码");
    // }
  }

  editTarget(item) {
    /**@description 修改操作 */
    for (const key in this.editForm) {
      this.editForm[key] = item[key];
    }
    if (item.emergencyPhone) {
      this["phoneNum"] = item.emergencyPhone.length;
    }
    // if (+item["age"]) {
    //   this.editForm["age"] = +item["age"];
    // } else if (item["age"] === "") {
    //   this.editForm["age"] = null;
    // }

    if (+item["earlyPeriod"]) {
      this.editForm["earlyPeriod"] = +item["earlyPeriod"];
    } else if (item["earlyPeriod"] === "") {
      this.editForm["earlyPeriod"] = null;
    }
    this.dialogEdit = true;
  }

  constraint(value, type) {
    // if (value > 200 && type === "age") {
    //   this["message"]("年龄不能大于200");
    // }
    if (value === "") {
      this.editForm[type] = null;
    }
  }

  updateFocusPeople() {
    /**@description 修改预警联系人 */
    // this.verification(this.editForm["emergencyPhone"], "editEmergencyPhone");
    // if (
    //   this.errorMessage["editEmergencyPhone"] === "" ||
    //   this.editForm["emergencyPhone"] === null ||
    //   this.editForm["emergencyPhone"].length === 11
    // ) {
    this.$refs["updateForm"]["validate"](valid => {
      if (valid) {
        var form = { ...this.editForm };
        form["earlyPeriod"] = Number(form["earlyPeriod"]);
        delete form["name"];
        editFocusPeople(form).then(() => {
          this.editClose();
          this["notify"]("success", "成功", "修改关注人员成功");
          this["fetchData"](this.initForm);
        });
      }
    });
    //   } else {
    //     this["message"]("请输入正确的电话号码");
    //   }
  }

  editNote(row) {
    /**@description 点击备注*/
    this.noteRewrite = row.note;
    this.editForm["note"] = row.note;
    this.editForm["id"] = row.id;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false;
    if (this.noteRewrite !== this.editForm["note"]) {
      this.confirmUpdateNote(row);
    }
  }

  confirmUpdateNote(item) {
    /**@description 修改备注 */
    const form = { note: this.editForm["note"], id: item.id };
    editFocusPeople(form).then(() => {
      this["notify"]("success", "成功", "修改关注人员备注成功");
      this["fetchData"](this.initForm);
    });
  }

  editClose() {
    this.dialogEdit = false; //修改dialog
    this.getTypeList();
    this.getGroupList();
    this.$refs["updateForm"]["resetFields"]();
  }

  handleClose() {
    /** @description 关闭添加/修改dialog */
    this["dialogCreate"] = false;
    this.createForm = {
      //清空添加表单字段
      // age: "",
      earlyGroupId: "",
      emergencyPhone: "",
      earlyPeriod: null,
      typeId: "",
      note: ""
    };
    this.getTypeList();
    this.getGroupList();
    this.$refs["dataForm"]["resetFields"]();
  }

  deleteBtn(item) {
    /**@description 单个删除状态 */
    this.$confirm("此操作将永久删除此关注人员信息, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteFocusPeople(item.id).then(() => {
          this["notify"]("success", "成功", "删除关注人员成功");
          this["fetchData"](this.initForm);
        });
      })
      .catch(err => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  showCarDetails(row, inviter) {
    this.detailDialogVisible = true;
    this.activeName = inviter;
    this.CarDialogForm = Object.assign({}, row);
    if (inviter === "first") {
      this.fetchUser();
    } else if (inviter === "second") {
      this.fetchEarlyContact();
    }
  }
  handleCurrentChangeEarly(val) {
    /** @description 处理目标预警组别翻页事件
     * @augments val: 页数
     */
    this.listEarlyQuery["page"] = val;
    this.fetchEarlyContact();
  }

  handleCurrentChangePass(val) {
    /** @description 处理目标关注人员通行记录翻页事件
     * @augments val: 页数
     */
    this.listQuery["page"] = val;
    this.fetchPass();
  }

  async handleClick(tab) {
    /**@description 查看关注人员名单目标详情 */
    if (tab.name === "first") {
      this.fetchUser();
    } else if (tab.name === "second") {
      this.listEarlyQuery["page"] = 1;
      this.fetchEarlyContact();
    } else if (tab.name === "thirdly") {
      this.listQuery["page"] = 1;
      this.fetchPass();
    }
  }

  async fetchEarlyContact() {
    /**@description 查看关注人员用户详情 */
    const info = {
      ...this.listEarlyQuery,
      earlyGroupId: this.CarDialogForm["earlyGroupId"]
    };
    this.earlyLoading = true;
    const { data } = await getWarning(info);
    this.earlyList = data.data.records;
    this.listEarlyQuery["total"] = data.data.total;
    this.earlyLoading = false;
  }

  async fetchUser() {
    /**@description 查看关注人员用户详情 */
    try {
      const { data } = await getOwnerUser(this.CarDialogForm["scenceUserId"]);
      this.userDetail = data.data.user;
    } catch (err) {
      console.log(err.response);
    }
  }

  async fetchPass() {
    const info = {
      ...this.listQuery,
      scenceUserId: this.CarDialogForm["scenceUserId"]
    };
    this.passTarget = true;
    const { data } = await getUserPass(info);
    this.passList = data.data.records;
    this.listQuery["total"] = data.data.total;
    this.passTarget = false;
  }

  closeBtn() {
    /**@description 关闭人员详情 */
    this.activeName = "first";
    this.detailDialogVisible = false; //人员详情dialog
    this.listQuery["page"] = 1;
    this.listEarlyQuery["page"] = 1;
  }

  isDisabled(row, index) {
    /**@discription 禁用多选 */
    if (row.auditResult == 3) {
      return 0;
    }
  }
}
</script>

<style lang="scss" scoped>
.leftContent {
  flex: none;
  width: 200px;
  display: flex;
}
.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
}
.input-new-tag {
  width: 120px;
}

.serial-num {
  position: relative;
}
</style>
