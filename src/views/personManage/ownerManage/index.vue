<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader
          exportUrl="/admin/usrUser/export"
          exportName="住户管理.xlsx"
          :initFormHeader="initForm"
          ref="actionHeader"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="showExportIn" v-if="globalUpdateStatus">导入</div>
            </el-dropdown-item>
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
              <el-input
                clearable
                placeholder="请输入需要查找的姓名"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model="filterForm.name"
                size="small"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">手机号:</span>
              <el-input
                clearable
                placeholder="请输入需要查找的手机号"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model="filterForm.phone"
                size="small"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">证件号码:</span>
              <el-input
                clearable
                placeholder="请输入需要查找的证件号码"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model="filterForm.cardNo"
                size="small"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">房屋编号:</span>
              <el-input
                clearable
                placeholder="请输入需要查找的房屋编号"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model="filterForm.key"
                size="small"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">住户类型:</span> &nbsp;&nbsp;
              <el-select
                multiple
                class="select-class"
                size="small"
                v-model="filterForm.types"
                placeholder="请选择"
              >
                <el-option label="业主" value="1"></el-option>
                <el-option label="租户" value="2"></el-option>
                <el-option label="家庭成员" value="3"></el-option>
              </el-select>
            </div>
            <div class="word-filter">
              <span class="filter-name">住户状态:</span> &nbsp;&nbsp;
              <el-select
                multiple
                class="select-class"
                size="small"
                v-model="filterForm.status"
                placeholder="请选择"
              >
                <el-option label="正常" value="0"></el-option>
                <!-- <el-option label="不在住" value="-1"></el-option> -->
                <el-option label="过期" value="-2"></el-option>
              </el-select>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-table
            :data="list_data"
            border
            highlight-current-row
            v-loading="showLoading"
            height="65vh"
            :span-method="objectSpanMethod"
            :row-class-name="tabRowClassName"
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column v-if="globalUpdateStatus" type="selection" align="center"></el-table-column>
            <el-table-column type="index" width="60" class="indexNum" align="center" label="编号">
              <template slot-scope="scope">
                <span>{{ scope.row.indexSort + 1 }}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="returnCommand('delete', scope.row)"
                      >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              width="100"
              class="serial-num"
              label="姓名"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="showDetail(scope.row, scope.$index, scope.row.indexSort)"
                >{{scope.row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              width="120"
              prop="phone"
              align="center"
              label="电话"
            >
              <template slot-scope="{row}">
                <!-- @keyup.enter.native="confirmUpdatePhone(row)" -->
                <span
                  class="rowUpdate"
                  v-show="!row.phoneStatus"
                  @click="phoneChange(row)"
                >{{ row.phone }}</span>
                <el-input
                  v-show="row.phoneStatus"
                  @blur="confirmUpdatePhone(row)"
                  :ref="row.id"
                  v-model="phoneString"
                  placeholder="输入电话"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="sex"
              align="center"
              width="50"
              label="性别"
            >
              <template slot-scope="{row}">
                <span>{{ row.sex === '1' ? '男' : '女' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="img" align="center" width="100" label="注册人脸">
              <template slot-scope="scope">
                <img
                  v-if="scope.row.face"
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.face"
                  :src="scope.row.face"
                  alt
                />
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="house_info"
              :show-overflow-tooltip="true"
              align="center"
              label="所属楼栋"
            >
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].groupName || '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="house_info"
              :show-overflow-tooltip="true"
              align="center"
              label="所属单元"
            >
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].buildingName || '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="house_info"
              :show-overflow-tooltip="true"
              align="center"
              label="房屋编号"
            >
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].serialNumber || '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              width="100"
              prop="status"
              align="center"
              label="住户状态"
            >
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].status | statusFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              width="100"
              prop="far_door"
              align="center"
              label="住户类型"
            >
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].type | typeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="car"
              width="100"
              align="center"
              label="邀请访客"
            >
              <template slot-scope="{row}">
                <el-dropdown @command="changeStatus" trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                      size="small"
                      :type="row.house[0] && row.house[0].enableInviteVisitor === '1' ? 'primary' : 'danger'"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    >{{ row.house[0] && row.house[0].enableInviteVisitor === '1' ? '允许' : '禁止' }}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="ComponentCommand('1', 'vistor', row)">允许</el-dropdown-item>
                    <el-dropdown-item :command="ComponentCommand('0', 'vistor', row)">禁止</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              width="100"
              prop="car"
              align="center"
              label="访客车辆"
            >
              <template slot-scope="{row}">
                <el-dropdown @command="changeStatus" trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                      size="small"
                      :type="row.house[0] && row.house[0].enableInviteCar === '1' ? 'primary' : 'danger'"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    >{{ row.house[0] && row.house[0].enableInviteCar === '1' ? '允许' : '禁止' }}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="ComponentCommand('1', 'car', row)">允许</el-dropdown-item>
                    <el-dropdown-item :command="ComponentCommand('0', 'car', row)">禁止</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              width="100"
              prop="far_door"
              align="center"
              label="远程开门"
            >
              <template slot-scope="{row}">
                <el-dropdown @command="changeStatus" trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                      size="small"
                      :type="row.house[0] && row.house[0].enableRemoteOpen === '1' ? 'primary' : 'danger'"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    >{{ row.house[0] && row.house[0].enableRemoteOpen === '1' ? '允许' : '禁止' }}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="ComponentCommand('1', 'remoteDoor', row)">允许</el-dropdown-item>
                    <el-dropdown-item :command="ComponentCommand('0', 'remoteDoor', row)">禁止</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="expire_time"
              align="center"
              label="过期时间"
            >
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].overTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="create_time"
              :show-overflow-tooltip="true"
              align="center"
              label="创建时间"
            >
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].createTime }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="detail"
              :show-overflow-tooltip="true"
              align="center"
              label="房屋备注"
            >
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].note }}</span>
              </template>
            </el-table-column>-->
          </el-table>
        </div>
        <el-pagination
          @current-change="pageChange"
          :page-size="page.limit"
          :current-page="page.page"
          style="margin-top:10px;"
          background
          layout="prev, pager, next"
          :total="page.total"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      :close-on-click-modal="false"
      class="dialog-rewrite"
      :title="detailDialog.name"
      :visible.sync="dialogFormVisible"
    >
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
          <el-form label-width="130px" :model="detailDialog">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="姓名:">
                  <span>{{detailDialog.name ? detailDialog.name : ''}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="性别:">
                  <span>{{ detailDialog.sex === '1' ? '男' : '女' }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="手机号:">
                  <span>{{detailDialog.phone ? detailDialog.phone : ''}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="证件类型:">
                  <span>{{detailDialog.cardName || '' }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="证件号码:">
                  <span>{{ detailDialog.cardNo || '' }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <el-input
                    @blur="confirmUpdateNote"
                    maxlength="200"
                    v-model="detailDialog.note"
                    placeholder="编辑备注信息(最多输入200字)"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="通行记录" name="second">
          <el-table :data="dtailTable" border stripe style="width: 100%">
            <el-table-column prop="name" align="center" label="姓名" width="150px"></el-table-column>
            <el-table-column
              prop="passTime"
              :show-overflow-tooltip="true"
              align="center"
              label="通行时间"
            ></el-table-column>
            <el-table-column prop="inOut" align="center" label="出入类型" width="100px"></el-table-column>
            <el-table-column prop="passMethod" align="center" width="150" label="通行方式">
              <template slot-scope="{row}">
                <span>{{ row.passMethod | passMethod }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="抓拍图片">
              <template slot-scope="{row}">
                <img v-if="row.photos" :src="row.photos" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="pagePassChange"
            style="margin-top:10px;"
            background
            layout="prev, pager, next"
            :total="passList.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="车辆信息" name="third">
          <el-table :data="carDtailTable" border stripe style="width: 100%">
            <el-table-column prop="carNo" align="center" label="车牌号"></el-table-column>
            <el-table-column prop="carType" align="center" label="车辆类型"></el-table-column>
            <el-table-column prop="modal" align="center" label="型号"></el-table-column>
            <el-table-column align="center" label="照片">
              <template slot-scope="{row}">
                <img v-if="row.photo" :src="row.photo" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="房屋信息" name="five">
          <el-table :data="houseDtailTable" stripe border style="width: 100%">
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="serialNumber"
              label="房屋编号"
            >
              <template slot-scope="{row}">
                <el-button
                  @click="showHouseDetail(row)"
                  type="text"
                >{{ row.groupName }} - {{ row.buildingName }} - {{ row. serialNumber}}</el-button>
              </template>
            </el-table-column>

            <el-table-column align="center" label="用户类型">
              <template slot-scope="{row}">{{ row.type | typeFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="邀请车辆">
              <template slot-scope="{row}">{{ row.enableInviteCar === '1' ? '允许' : '禁止' }}</template>
            </el-table-column>
            <el-table-column align="center" label="邀请访客">
              <template slot-scope="{row}">{{ row.enableInviteVisitor === '1' ? '允许' : '禁止' }}</template>
            </el-table-column>
            <el-table-column align="center" label="远程开门">
              <template slot-scope="{row}">{{ row.enableRemoteOpen === '1' ? '允许' : '禁止' }}</template>
            </el-table-column>

            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
              <template slot-scope="{row}">
                <span>{{row.note}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="创建时间"
            ></el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="操作"
              :key="Math.random()"
              v-if="globalUpdateStatus"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="deleteHouse(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="人脸库信息" name="six">
          <el-table :data="faceList" stripe border style="width: 100%">
            <el-table-column align="center" width="50" type="index" label="编号"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="devSerialNumber"
              label="设备编号"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="devType"
              label="设备区分"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="address"
              label="通行位置"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="createTime"
              label="注册时间"
            ></el-table-column>
            <el-table-column width="80" align="center" label="人脸图片">
              <template slot-scope="{row}">
                <img v-if="row.face" :src="row.face" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      top="10vh"
      class="dialog-rewrite-user"
      :close-on-click-modal="false"
      title="添加住户"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        class="owner"
        :model="Form"
        :rules="rules"
        ref="Forms"
        label-width="100px"
        style="margin-right:40px;"
      >
        <el-form-item style="margin-bottom:16px;" label="电话:" prop="phone">
          <el-autocomplete
            style="width:100%"
            clearable
            @keyup.native="UpNumber"
            @keydown.native="UpNumber"
            @change="clearableBtn"
            @input="hint"
            @focus="hintFocus"
            @blur="hintBlur"
            :maxlength="11"
            @mouseover.native="hint(Form.phone)"
            @mouseout.native="hint(Form.phone)"
            v-model="Form.phone"
            :fetch-suggestions="remoteMethod"
            placeholder="输入需要添加的住户电话"
            @select="handleSelectWatchlist"
          >
            <template slot-scope="{ item }">
              <span style="float: left">{{ item.phone }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <!-- <el-row>
        <el-col :span="12">-->
        <el-form-item style="margin-bottom:16px;" label="姓名:" prop="name">
          <el-input
            :disabled="nameDisabled"
            clearable
            maxlength="10"
            v-model="Form.name"
            placeholder="输入姓名"
          ></el-input>
        </el-form-item>
        <!-- </el-col>
        <el-col :span="12">-->
        <el-form-item style="margin-bottom:16px;" label="性别:" prop="sex">
          <el-select
            style="width:100%"
            :disabled="nameDisabled"
            size="small"
            v-model="Form.sex"
            placeholder="请选择"
          >
            <el-option label="请选择" value></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        </el-row>-->

        <!-- <el-row>
        <el-col :span="Form.otherCardName === '其它' ? 12 : 24">-->
        <el-form-item style="margin-bottom:16px;" label="证件类型:" prop="otherCardName">
          <el-select
            style="width:100%"
            :disabled="nameDisabled"
            @change="Form.cardNo = '',Form.cardName = ''"
            size="small"
            v-model="Form.otherCardName"
            placeholder="请选择证件类型"
          >
            <el-option label="身份证" value="身份证"></el-option>
            <el-option label="护照" value="护照"></el-option>
            <el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col>
        <el-col :span="Form.otherCardName === '其它' ? 12 : 0">-->
        <el-form-item
          style="margin-bottom:16px;"
          v-show="Form.otherCardName === '其它'"
          label="证件名称:"
          prop="cardName"
        >
          <el-input
            :disabled="nameDisabled"
            maxlength="10"
            v-model="Form.cardName"
            clearable
            placeholder="证件名称"
          ></el-input>
        </el-form-item>
        <!-- </el-col>
        </el-row>-->

        <el-form-item style="margin-bottom:16px;" label="证件号码:" prop="cardNo">
          <el-input
            :disabled="nameDisabled"
            :maxlength="Form.otherCardName === '身份证' ? '18' : '20'"
            clearable
            v-model="Form.cardNo"
            :placeholder="'输入证件号'"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:16px;clear:both" label="住户房屋:" prop="houseName">
          <el-autocomplete
            style="width:100%"
            clearable
            v-model="Form.houseName"
            :fetch-suggestions="querySearch"
            placeholder="房屋搜索查找需要关联的房屋"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="value">{{ item.name }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item style="margin-bottom:16px;" label="已选:" prop="house">
          <div v-if="Form.house.length">
            <div v-for="(item, index) in Form.house" :key="index">
              {{item.buildingName}}
              <el-button type="text" @click="updateAddHouse(index, item)">编辑</el-button>
              <el-button type="text" @click="deleteAddHouse(index)">删除</el-button>
            </div>
          </div>
          <span v-else>通过上面房屋搜索查找需要关联的房屋</span>
        </el-form-item>
        <el-form-item style="margin-bottom:16px;" label="备注信息:" prop="note">
          <el-input type="textarea" v-model="Form.note" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="addUserConfirm">确 定</el-button>
      </span>
      <!-- 增加房屋时修改房屋 -->
    </el-dialog>
    <el-dialog
      top="10vh"
      :close-on-click-modal="false"
      width="500px"
      :title="updateHouseForm.buildingName"
      :visible.sync="updateHouseVisible"
    >
      <el-form
        :model="updateHouseForm"
        label-width="100px"
        label-position="right"
        style="margin:20px 40px 0 0;"
      >
        <el-form-item label="住户类型">
          <el-select style="width:320px" v-model="updateHouseForm.type" placeholder="请选择">
            <el-option label="业主" value="1"></el-option>
            <el-option label="租户" value="2"></el-option>
            <el-option label="家庭成员" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="房屋状态">
          <el-select v-model="updateHouseForm.status" placeholder="请选择活动区域">
            <el-option label="正常" value="0"></el-option>
            <el-option label="不在住" value="-1"></el-option>
            <el-option label="过期" value="-2"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item v-if="updateHouseForm.type !== '1'" label="过期时间">
          <el-date-picker
            style="width:320px"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="updateHouseForm.overTime"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="邀请访客">
          <el-switch
            v-model="updateHouseForm.enableInviteVisitor"
            active-text="允许"
            active-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-value="0"
            inactive-text="禁止"
          ></el-switch>
        </el-form-item>
        <el-form-item label="邀请车辆">
          <el-switch
            v-model="updateHouseForm.enableInviteCar"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="允许"
            inactive-text="禁止"
          ></el-switch>
        </el-form-item>
        <el-form-item label="远程开门">
          <el-switch
            v-model="updateHouseForm.enableRemoteOpen"
            active-value="1"
            inactive-value="0"
            active-text="允许"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="禁止"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注信息:" prop="note">
          <el-input
            style="width:320px"
            type="textarea"
            v-model="updateHouseForm.note"
            placeholder="输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateHouseVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmHouse">确 定</el-button>
      </div>
    </el-dialog>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <!-- 房屋信息 -->
    <el-dialog
      :close-on-click-modal="false"
      class="dialog-rewrite"
      :title="'编号: '+ houseDetailDialog.serialNumber"
      :visible.sync="HouseDialogFormVisible"
    >
      <el-tabs type="card" v-model="houseActiveName">
        <el-tab-pane label="详细信息" name="详细信息">
          <el-form label-width="130px" :model="houseDetailDialog">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="所在单元:">
                  <span>{{houseDetailDialog.buildingName ? houseDetailDialog.buildingName : '0'}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="所在楼层:">
                  <span>{{houseDetailDialog.storeyNum ? houseDetailDialog.storeyNum : ''}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="房屋编号:">
                  <span>{{houseDetailDialog.serialNumber ? houseDetailDialog.serialNumber : ''}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="注册时间:">
                  <span>{{houseDetailDialog.createTime && houseDetailDialog.createTime.substr(0, 10)}}</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="注册人数:">
                  <span>{{houseDetailDialog.personCnt ? houseDetailDialog.personCnt : '0'}}人</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="房屋状态:">
                  <span>{{houseDetailDialog.status | status}}</span>
                </el-form-item>

                <!-- <el-form-item style="margin-bottom:0" label="业主电话:">
                  <span>{{houseDetailDialog.phone || ''}}</span>
                </el-form-item>-->

                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{ houseDetailDialog.note || '' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="在住人员" name="在住人员">
          <el-table v-loading="showLoading" stripe border :data="HouseDtailTable" style="width: 100%">
            <el-table-column
              align="center"
              width="50"
              :show-overflow-tooltip="true"
              type="index"
              label="序号"
            ></el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="userName"
              label="姓名"
            ></el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="userPhone"
              label="电话"
            ></el-table-column>
            <el-table-column align="center" width="80" prop="type" label="人员类型">
              <template slot-scope="{row}">
                <span>{{ row.type | type }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="注册时间"
            ></el-table-column>

            <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注">
              <template slot-scope="{row}">
                <span>{{ row.note ? row.note : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="操作"
              :key="Math.random()"
              v-if="globalUpdateStatus"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="deleteHousePeople(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="HouseDialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <ExportIn
      :uploadUrl="env === 'production' ? 'http://47.103.184.184/admin/usrUser/import' : '/v1/admin/usrUser/import'"
      downTemplateUrl="/admin/usrUser/model"
      @closeVisible="closeVisible"
      @successUpload="fetchData(initForm)"
      :visible.sync="visible"
    />
  </div>
</template>
<script lang="ts">
declare function require(string): string;
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import {
  addPeople,
  updateUserPhone,
  updateUserNote,
  updateRoleHouse
} from "@/api/peopleApi.ts";
import _axios from "@/plugins/axios.js";
import mixin from "@/config/minxins";
import {
  searchSuggestHouse,
  deleteTheHousePeople,
  getRegisterPeople
} from "@/api/houseApi.ts";
import { getUserPropertyPass, getFaceList } from "@/api/peopleApi.ts";
import {
  queryUserPhone //根据手机号模糊查询住户
} from "@/api/peopleApi.ts";
import { getUserPropertyCar } from "@/api/carApi.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DiaLog = () => import("@/components/dialog.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DiaLog,
    BigImg,
    ExportIn
  },
  filters: {
    status(val: string) {
      const data = {
        "1": "自住",
        "2": "出租",
        // "3": '待售中',
        // "4": '待租中',
        "3": "闲置"
        // "6": '其他'
      };
      return data[val];
    },
    statusFilter(val: string) {
      const data = {
        "0": "正常",
        // "-1": "不在住",
        "-2": "过期"
      };
      return data[val];
    },
    typeFilter(val: string) {
      const data = {
        "1": "业主",
        "2": "租户",
        "3": "家庭成员"
      };
      return data[val];
    },
    type(val: string) {
      const data = {
        "1": "业主",
        "2": "租户",
        "3": "家庭成员"
      };
      return data[val];
    },
    passMethod(val: string) {
      const data = {
        "1": "人脸开门",
        "2": "二维码开门",
        "3": "蓝牙开门",
        "4": "远程开门",
        "5": "密码开门",
        "6": "刷卡开门"
      };
      return data[val];
    }
  }
})
export default class OwnerManage extends Vue {
  btnLoading: boolean = false;
  private activeName: string = "first";
  private houseActiveName: string = "详细信息";
  private dialogFormVisible: boolean = false;
  private HouseDialogFormVisible: boolean = false;
  UserType: string = "owner";
  spanArray: Array<number> = []; // 合并单元格
  index: number = 0; // 合并单元格参数
  private detailDialog: Object = {
    note: ""
  };
  env: string = process.env.NODE_ENV;
  phoneString: string = ""; // 需要改成的电话
  noteString: string = ""; // 需要改成的备注
  houseIndex: number = 0; // 合并单元格用
  updateHouseVisible: boolean = false; // 修改房屋弹框
  data: Array<object> = []; // 未分单元格人员数据
  faceList: Array<object> = []; // 人脸库列表
  facePage: object = {
    page: 1,
    total: 1,
    limit: 10,
    userId: ""
  };
  personImg: string = require("@/assets/defaultPerson.png"); // 人员头像
  Form: any = {
    name: "",
    cardName: "",
    cardNo: "",
    sex: "",
    phone: "",
    house: [],
    note: "",
    houseName: "",
    otherCardName: "身份证"
  };
  updateHouseForm: object = {}; // 增加住户时修改房屋的属性
  initForm: object = {
    url: "/admin/usrUser/list",
    method: "get"
  };
  filterForm: object = {
    name: "",
    phone: "",
    key: "",
    types: [],
    cardNo: "",
    status: []
  };
  deleteForm: object = {
    url: "/admin/usrUser",
    method: "delete",
    data: [],
    message: "此操作将永久删除选中的住户, 删除后住户将不存在,请谨慎操作!"
  };
  houseDetailDialog: object = {};
  loading: boolean = false;
  phoneList: Array<object> = [];
  nameDisabled: boolean = false;
  HouseDtailTable: Array<object> = []; // 房屋下的注册人员
  visible: boolean = false; // 批量导入状态
  updateArray: Array<string> = ["noteStatus", "phoneStatus"];
  rules: any = {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    sex: [{ required: true, message: "请选择性别", trigger: "change" }],
    cardName: [{ required: true, message: "请填入证件名", trigger: "change" }],
    phone: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (!this["is_Phone"](value)) {
            callback(new Error("填写正确的手机号"));
          } else {
            callback();
          }
        },
        trigger: "blur"
      }
    ],
    cardNo: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (
            !(value.length === 15 || value.length === 18) &&
            this.Form["otherCardName"] === "身份证"
          ) {
            callback(new Error("填写正确的证件号号"));
          } else {
            callback();
          }
        }
      }
    ],
    otherCardName: [
      { required: true, trigger: "change", message: "请选择证件" }
    ],
    house: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (!value.length) {
            callback(new Error("请添加房屋"));
          } else {
            callback();
          }
        },
        trigger: "change"
      }
    ]
  };
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  passList: object = {
    id: "",
    limit: 10,
    page: 1
  };
  userId: string = "";
  private dtailTable: Array<Object> = [];
  private carDtailTable: Array<Object> = [];
  private houseDtailTable: Array<Object> = [];
  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  // 删除某个用户下的某个房屋
  deleteHouse(row, index) {
    this.$confirm(
      "此操作将永久删除该用户下的房屋,删除后房屋将不会与住户绑定,请谨慎操作!?",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        console.log(row);
        deleteTheHousePeople(row.houseId, this.userId, " ").then(res => {
          if (res.data.code === 200) {
            this["message"]("success", "删除成功");
            this.houseDtailTable.splice(index, 1);
          }
        });
      })
      .catch(() => {
        this["message"]("error", "已取消删除");
      });
  }
  // 用户详情页 点击房屋编号查看更多信息
  showHouseDetail(row) {
    console.log(row);
    this.HouseDialogFormVisible = true;
    this.houseDetailDialog = Object.assign({}, row);
    this.houseActiveName = "详细信息";
    getRegisterPeople(row.houseId).then(res => {
      this.HouseDtailTable = res.data.data;
    });
  }
  // 删除房屋下的某个用户
  deleteHousePeople(row, index) {
    this.$confirm(
      `此操作将永久删除该房屋下的住户,删除后${row.userName}将不与该房屋绑定,请谨慎操作!?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        deleteTheHousePeople(row.houseId, row.userId, " ").then(res => {
          if (res.data.code === 200) {
            this.HouseDtailTable.splice(index, 1);
            this.fetchData(this.initForm);
          }
          // getRegisterPeople(this.houseId).then(res => {
          //   this.dtailTable = res.data.data;
          //   this.fetchData(this.initForm)
          // });
        });
      })
      .catch(() => {
        this["message"]("error", "已取消删除");
      });
  }
  async remoteMethod(query: string, cb) {
    /**@description 根据姓名模糊查询人员 */
    if (query !== "") {
      this.loading = true;
      setTimeout(async () => {
        if (query.length >= 1 && query.length < 12) {
          const { data } = await queryUserPhone(query);
          this.loading = false;
          this.phoneList = data.data;
          if (!this.phoneList.length) {
            this.$refs["Forms"]["clearValidate"]();
            this.Form["name"] = "";
            this.Form["sex"] = "";
            this.Form["otherCardName"] = "身份证";
            this.Form["cardName"] = "";
            this.Form["cardNo"] = "";
            this.nameDisabled = false;
          }
          cb(this.phoneList);
        } else {
          cb([]);
        }
      }, 200);
    } else {
      this.$refs["Forms"]["resetFields"]();
      cb([]);
    }
  }
  /**
   *
   * @param page 关闭添加/修改框
   */
  handleClose() {
    for (let key in this.Form) {
      this.Form[key] = "";
    }
    this.Form["house"] = [];
    this.$refs["Forms"]["resetFields"]();
    this["dialogCreate"] = false;
    this.nameDisabled = false;
  }
  handleSelectWatchlist(item) {
    this.$refs["Forms"]["clearValidate"]();
    const Name = ["身份证", "护照", "港澳居民来往内地通行证"];
    this.Form["phone"] = item.phone;
    // if (item.name) {
    this.Form["name"] = item.name;
    this.Form["sex"] = item.sex;
    this.Form["otherCardName"] = Name.includes(item.cardName)
      ? item.cardName
      : "其它";
    this.Form["cardName"] = item.cardName;
    this.Form["cardNo"] = item.cardNo;
    this.nameDisabled = true;
    // } else {
    //   this.Form['name'] = '';
    //   this.nameDisabled = false;
    // }
  }
  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  showExportIn() {
    this.visible = true;
  }
  // 修改手机号
  phoneChange(row) {
    this.phoneString = row.phone;
    this["list_data"].forEach(el => {
      this.$set(el, "phoneStatus", false);
    });
    this.$set(row, "phoneStatus", !row.phoneStatus);
    // row.phoneStatus = !row.phoneStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }
  ComponentCommand(Status: string, type: string, row: object) {
    return {
      ...row,
      type,
      Status
    };
  }
  // 修改远程开门，邀请访客，邀请车辆
  changeStatus(Obj: Object) {
    console.log(Obj);
    let data: object = {
      id: Obj["house"][0]["id"]
    };
    switch (Obj["type"]) {
      case "car":
        data["enableInviteCar"] = Obj["Status"];
        break;
      case "vistor":
        data["enableInviteVisitor"] = Obj["Status"];
        break;
      case "remoteDoor":
        data["enableRemoteOpen"] = Obj["Status"];
        break;
    }
    updateRoleHouse(data).then(res => {
      if (res.data.code === 200) {
        this["message"]("success", "设置成功");
        this.fetchData(this.initForm);
      }
    });
  }
  // 确定添加住户
  addUserConfirm() {
    this.btnLoading = true;
    if (this.Form.otherCardName !== "其它") {
      this.Form.cardName = this.Form.otherCardName;
    }

    this.$refs["Forms"]["validate"](valid => {
      if (valid) {
        if (!this.Form["house"].length) {
          this.btnLoading = false;
          this["message"]("error", "未选择房屋");
          return;
        }
        addPeople(this.Form)
          .then(res => {
            if (res.data.code === 200) {
              this["message"]("success", "添加成功");
              this["dialogCreate"] = false;
              this.Form["house"] = [];
              this["handleClose"]();
              this.fetchData(this.initForm);
              this.btnLoading = false;
            }
          })
          .catch(err => {
            this.btnLoading = false;
          });
      } else {
        this.btnLoading = false;
      }
    });
  }
  // 修改电话离开输入框
  phoneBlur(row) {
    row.phoneStatus = false;
    this.phoneString = "";
  }
  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false;
    this.noteString = "";
  }
  // 确定修改 电话
  confirmUpdatePhone(row) {
    if (!/^1[123456789]\d{9}$/.test(this.phoneString)) {
      this["message"]("error", "请输入正确的手机格式");
      this.$set(row, "phoneStatus", false);
      return;
    }
    this.$confirm(`此操作将永久修改${row.name}电话号码,请谨慎操作!`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        updateUserPhone(row.id, this.phoneString)
          .then(res => {
            if (res.data.code === 200) {
              this["message"]("success", "修改成功");
              this.phoneString = "";
              this.fetchData(this.initForm);
            } else {
              this["message"]("error", res.data.message);
            }
          })
          .catch(() => {
            this.$set(row, "phoneStatus", false);
          });
      })
      .catch(() => {
        this.$set(row, "phoneStatus", false);
        this["message"]("error", "已取消修改");
      });
  }
  // 确定修改 备注
  confirmUpdateNote() {
    if (!this.detailDialog["note"]) {
      return this["message"]("error", "请输入备注信息");
    }
    updateUserNote(this.detailDialog["id"], this.detailDialog["note"]).then(
      res => {
        if (res.data.code === 200) {
          this["message"]("success", "修改成功");
          this.noteString = "";
          this.fetchData(this.initForm);
        } else {
          this["message"]("error", res.data.message);
        }
      }
    );
  }
  // 打开修改房屋的状态
  updateAddHouse(index, item) {
    this.houseIndex = index;
    this.updateHouseVisible = true;
    this.updateHouseForm = Object.assign({}, item);
  }
  // 将重新定义的数据 换到 house字段去
  confirmHouse() {
    if (this.updateHouseForm["type"] !== "1") {
      if (
        this.updateHouseForm["overTime"] === "" ||
        this.updateHouseForm["overTime"] === null
      ) {
        return this["message"]("error", "租客和家庭成员需要添加过期时间");
      }
    }
    this.Form["house"][this.houseIndex] = Object.assign(
      {},
      this.updateHouseForm
    );
    this.updateHouseVisible = false;
    this.updateHouseForm = {};
  }
  // 重写fetchdata函数
  fetchData(option: object) {
    this["list_data"] = [];
    for (let key in option["params"]) {
      if (option["params"][key] === "") {
        option["params"][key] = null;
      }
    }
    this["showLoading"] = true;
    _axios(option).then((res: any) => {
      if (res.data && res.data.data) {
        this.page["total"] = res.data.data.total;
        this.page["limit"] = res.data.data.size;
        this.data = res.data.data.records;
        res.data.data.records.forEach((ele: object) => {
          let singleObj = {};
          if (ele["house"].length > 1) {
            ele["house"].forEach(item => {
              singleObj = Object.assign({}, ele);
              singleObj["house"] = [];
              this.$set(singleObj, "showMenu", false);
              singleObj["house"].push(item);
              this["list_data"].push(singleObj);
            });
          } else {
            this.$set(ele, "showMenu", false);
            this["list_data"].push(ele);
          }
        });
        this["list_data"].forEach((ele, index) => {
          this["updateArray"].forEach((itemStatus: string) => {
            ele[itemStatus] = false;
            if (index === 0) {
              ele["indexSort"] = 0;
            } else {
              if (ele["id"] === this["list_data"][index - 1]["id"]) {
                ele["indexSort"] = this["list_data"][index - 1]["indexSort"];
              } else {
                ele["indexSort"] =
                  this["list_data"][index - 1]["indexSort"] + 1;
              }
            }
          });
        });
        console.log(this["list_data"]);
        // this['list_data'] = res.data.data.records
        this["showLoading"] = false;
        this.spanArray = [];
        this.index = 0;
        this["list_data"].forEach((item, index) => {
          item.index = index;
          if (index === 0) {
            this.spanArray.push(1);
          } else {
            if (item.id === this["list_data"][index - 1].id) {
              this.spanArray[this.index] += 1;
              this.spanArray.push(0);
            } else {
              this.index = index;
              this.spanArray.push(1);
            }
          }
        });
      }
    });
  }
  // 添加房屋时删除房屋
  deleteAddHouse(index) {
    this.Form.house.splice(index, 1);
  }
  // 选择搜索建议列表某项 并赋值
  handleSelect(val: object) {
    let Obj = {
      buildingName: "",
      type: "1",
      status: "0",
      overTime: null,
      note: "",
      houseId: "",
      enableRemoteOpen: "0",
      enableInviteCar: "0",
      enableInviteVisitor: "0"
    };
    Obj.houseId = val["id"];
    Obj.buildingName = val["name"];
    this.Form.house.unshift(Obj);
    this.updateAddHouse(0, Obj);
  }
  // 房屋搜索建议
  querySearch(string: string, cb) {
    let result = [];
    searchSuggestHouse(string).then(res => {
      if (res.data.data) {
        result = res.data.data;
        result.splice(10);
        let arr: Array<object> = [];
        result.forEach((item, index) => {
          if (JSON.stringify(this.Form.house).indexOf(item["id"]) === -1) {
            arr.push(item);
          }
        });
        cb(arr);
      }
    });
  }

  tabRowClassName({ row, rowIndex }) {
    let index = row.indexSort + 1;
    if (row.indexSort % 2 == 0) {
      return "info-row";
    }
    return "";
  }

  // 合并单元格
  objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    if (
      columnIndex === 0 ||
      columnIndex === 1 ||
      columnIndex === 2 ||
      columnIndex === 3 ||
      columnIndex === 4 ||
      columnIndex === 5
    ) {
      const _row_1 = this.spanArray[rowIndex];
      const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
      return {
        rowspan: _row_1,
        colspan: _col_1
      };
    }
  }

  /*** row 列表数据 查看详情*/
  showDetail(row, index, indexSort) {
    this.userId = row.id;
    this.activeName = "first";
    this.passList["id"] = row.id;
    this.dialogFormVisible = true;
    this.detailDialog = Object.assign(
      this.detailDialog,
      this["list_data"][index]
    );
    this.houseDtailTable = this.data[indexSort]["house"];
    // 获取人员通行记录
    this.pagePassChange(1);
    // 获取物业人员的车辆信息
    getUserPropertyCar(row.id).then(res => {
      this.carDtailTable = res.data.data;
    });
    this.facePage["userId"] = row.id;
    // 获取人脸库信息
    this.fetchFaceList(1);
  }

  // 获取人脸库列表
  fetchFaceList(page: number) {
    this.facePage["page"] = page;
    getFaceList(this.facePage).then(res => {
      this.facePage["total"] = res.data.data.total;
      this.faceList = res.data.data.records;
    });
  }

  // 获取特定住户的通行记录
  pagePassChange(page: number) {
    this.passList["page"] = page;
    getUserPropertyPass(this.passList).then(res => {
      this.dtailTable = res.data.data.records;
      this.passList["total"] = res.data.data.total;
    });
  }
}
</script>

<style lang="scss" scoped>
.mainAddContain {
  width: 100%;
  height: 200px;
  display: flex;
  .pic {
    width: 140px;
    height: 140px;
    flex: none;
    overflow: hidden;
    border: 1px dotted gray;
    font-size: 48px;
    text-align: center;
    line-height: 140px;
    border-radius: 10px;
  }
  .form {
    flex: 1;
  }
}
.floatForm {
  width: 50%;
  float: left;
  position: relative;
  z-index: 999;
}
.right {
  width: 62px;
  display: inline-block;
  height: 30px;
  text-align: right;
}
</style>
