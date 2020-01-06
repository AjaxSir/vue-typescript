<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          exportUrl="/admin/car-space/export"
          exportName="车位.xls"
          ref="actionHeader"
          :addDisabled="addDisabled"
          :initFormHeader="initForm"
          :houseStatus="false"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="addDisabled">
              <div @click="addstalls">批量添加车位</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="showExportIn">导入</div>
            </el-dropdown-item>
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;&nbsp;名:</span>
              <el-input
                class="input-filter"
                size="small"
                clearable
                v-model="filterForm.ownerName"
                placeholder="请输入姓名"
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">电&nbsp;&nbsp;&nbsp;&nbsp;话:</span>
              <el-input
                class="input-filter"
                size="small"
                clearable
                v-model="filterForm.ownerPhone"
                placeholder="请输入电话"
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">编&nbsp;&nbsp;&nbsp;&nbsp;号:</span>
              <el-input
                class="input-filter"
                size="small"
                clearable
                v-model="filterForm.serialNumber"
                placeholder="请输入编号"
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <!-- <div class="word-filter">
              <span class="filter-name">车&nbsp;&nbsp;牌&nbsp;&nbsp;号:</span>
              <el-input
                class="input-filter"
                size="small"
                clearable
                v-model="filterForm.cardName"
                placeholder="请输入车牌"
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>-->
            <div class="word-filter">
              <span class="filter-name filter-rewrite">车位状态:</span>
              <el-select
                class="select-class"
                size="small"
                multiple
                v-model="filterForm.status"
                placeholder="请选择车位状态"
              >
                <el-option
                  v-for="item in carType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="word-filter">
              <span class="filter-name filter-rewrite">车位类型:</span>
              <el-select
                class="select-class"
                size="small"
                multiple
                v-model="filterForm.carSpaceTypeId"
                placeholder="请选择车位类型"
              >
                <el-option
                  v-for="item in carStatusFilter"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="rowSpan.row1">
        <data-tree
          ref="dataTree"
          @fetchDatas="fetchDatas"
          :page="page"
          :initFormHeader="initForm"
          :listData="list_data"
          :groupDisable="groupDisable"
          @getHouseTreeData="getHouseTreeData"
          :TreeData="TreeData"
        />
      </el-col>

      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <el-table
            :data="list_data"
            stripe
            height="65vh"
            border
            v-loading="showLoading"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @selection-change="handleSelectionChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column v-if="globalUpdateStatus" type="selection" align="center" width="50"></el-table-column>

            <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <div v-if="scope.row.status==='已售（自用）' || scope.row.status==='已售（出租）'">
                        <div v-if="!deleteForm.data.length" @click="editTarget(scope.row)">
                          <el-dropdown-item command="update">修改业主</el-dropdown-item>
                        </div>
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
              align="center"
              prop="carSpaceGroupName"
              label="所属分组"
              :show-overflow-tooltip="true"
              max-width="120"
            ></el-table-column>

            <el-table-column
              align="center"
              prop="serialNumber"
              width="200px"
              :show-overflow-tooltip="true"
              label="编号"
            ></el-table-column>

            <el-table-column
              width="120"
              align="center"
              prop="type"
              label="状态"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <el-tag
                      type="info"
                      size="small"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                      @click="editStatus(row)"
                    >{{ row.status ? row.status :'--'}}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="已售（自用）">已售（自用）</el-dropdown-item>
                    <el-dropdown-item command="已售（出租）">已售（出租）</el-dropdown-item>
                    <el-dropdown-item command="未售（出租）">未售（出租）</el-dropdown-item>
                    <el-dropdown-item command="未售（闲置）">未售（闲置）</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <el-table-column
              prop="ownerName"
              width="120"
              align="center"
              label="业主"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.ownerName"
                  @click="showHouseDetails(scope.row,'first')"
                  type="text"
                >{{ scope.row.ownerName }}</el-button>
                <span v-else></span>
              </template>
            </el-table-column>

            <el-table-column
              prop="carSpaceTypeName"
              width="120"
              align="center"
              label="车位类型"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">
                <el-dropdown trigger="click" @command="handlEcarSpaceType">
                  <span class="el-dropdown-link">
                    <el-tag
                      type="info"
                      size="small"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                      @click="editStatus(row)"
                    >{{ row.carSpaceTypeName ? row.carSpaceTypeName :'--'}}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in carStatus"
                      :key="item.id"
                      :command="item.id"
                    >{{item.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <el-table-column prop="carNo" align="center" label="绑定车辆" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status!=='未售（闲置）'"
                  @click="bindingPlates(scope.row)"
                  type="text"
                >
                  <div
                    style="width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                    v-if="scope.row.carSpaceVos && scope.row.carSpaceVos.length > 0"
                  >
                    <span
                      v-for="(item,index) in scope.row.carSpaceVos"
                      :key="'carSpaceVos' + index"
                    >
                      {{item.carNo}}
                      <span
                        v-if="scope.row.carSpaceVos && scope.row.carSpaceVos.length > 1"
                      >,</span>
                    </span>
                  </div>

                  <span v-else>--</span>
                </el-button>
                <p style="height:40px;line-height:40px" v-else></p>
              </template>
            </el-table-column>

            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
              <template slot-scope="scope">
                <span
                  class="rowUpdate"
                  v-show="!scope.row.noteStatus"
                  @click="focusNoteInput(scope.row)"
                >{{ scope.row.note || '--' }}</span>
                <el-input
                  size="mini"
                  :ref="scope.row.id"
                  @blur="noteBlur(scope.row)"
                  v-model="noteString"
                  v-show="scope.row.noteStatus"
                  :clearable="true"
                  placeholder="输入备注"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageChange"
            :page-size="page.limit"
            style="margin-top:10px;"
            :current-page.sync="page.page"
            background
            layout="prev, pager, next"
            :total="page.total"
          ></el-pagination>
          <div :class="rowSpan.row1===3 ? menuControl1 : menuControl2" @click="menuVisible">
            <p class="close-menu">
              <i v-if="rowSpan.row1===3" class="iconfont icon-left icon-class"></i>
              <i v-else class="iconfont icon-zuo icon-class"></i>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 批量添加车位 -->
    <el-dialog
      :before-close="closeDialog"
      :close-on-click-modal="false"
      width="500px"
      class="formDialog"
      :title="'批量添加车位'"
      :visible.sync="dialogAdds"
    >
      <el-form
        ref="batchForm"
        :rules="batchRules"
        :model="batchForm"
        label-width="100px"
        label-position="right"
        style="margin:20px 40px 0 0;"
      >
        <el-form-item label="所属分组:" prop="carSpaceGroupId">
          <span>{{carSpaceGroup.carSpaceGroupName}}</span>
          <!-- <el-cascader
            style="width:100%"
            v-model="batchForm.carSpaceGroupId"
            :options="TreeData"
            :show-all-levels="false"
            :props="{ label: 'name', children: 'sonCarSpaceGroups', value: 'id' }"
            @change="handleChangeBatch"
          ></el-cascader>-->
        </el-form-item>

        <el-form-item prop="start" label="起止编号:">
          <el-input
            clearable
            placeholder="开始编号"
            style="width:140px"
            :maxlength="5"
            v-model="batchForm.start"
            @keydown.native="UpNumber"
            @keyup.native="inputHouseCheck"
            @change="hintChange"
            @input="constraintLength(batchForm.start,'5')"
          ></el-input>&nbsp;&nbsp;至&nbsp;&nbsp;
          <el-input
            clearable
            placeholder="结束编号"
            style="width:140px"
            :maxlength="5"
            v-model="batchForm.end"
            @keydown.native="UpNumber"
            @keyup.native="inputHouseCheck"
            @change="hintChange"
            @input="constraintLength(batchForm.end,'5')"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="车位类型:"
          prop="carSpaceTypeId"
          :show-message="showMessage"
          :error="errorMessage.carSpaceTypeId"
        >
          <el-select
            style="width:100%"
            v-model="batchForm.carSpaceTypeId"
            placeholder="请选择"
            @change="changeSelect"
          >
            <el-option v-for="item in carStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="生成示例:" prop="note" label-width="85px">
          <p
            style="height:16px;"
            v-for="(item,index) in sample.slice(0,2)"
            :key="'unit'+index"
          >{{item}}</p>
          <p style="height:16px;" v-if="sample.length>2">...</p>
          <div v-if="sample.length>2">
            <p
              style="height:16px;"
              v-for="(item,index) in sample.slice(sample.length-1)"
              :key="'unitend'+index"
            >{{item}}</p>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="createStalls">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加车位 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加车位"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        :model="createForm"
        :rules="rules"
        ref="dataForm"
        label-width="100px"
        label-position="right"
        style="margin-right:40px;"
      >
        <el-form-item label="所属分组:" prop="carSpaceGroupId">
          <span>{{carSpaceGroup.carSpaceGroupName}}</span>
          <!-- <el-cascader
            style="width:100%"
            v-model="createForm.carSpaceGroupId"
            :options="TreeData"
            :show-all-levels="false"
            :props="{ label: 'name', children: 'sonCarSpaceGroups', value: 'id' }"
            @change="handleChange"
          ></el-cascader>-->
        </el-form-item>

        <el-form-item label="车位编号:" prop="serialNumber">
          <el-input
            clearable
            v-model="createForm.serialNumber"
            placeholder="请输入车位编号"
            :maxlength="10"
            @input="constraintLength(createForm.serialNumber,'10')"
          ></el-input>
        </el-form-item>

        <el-form-item label="车位状态:" prop="status">
          <el-select
            style="width:100%"
            v-model="createForm.status"
            placeholder="请选择"
            @change="selectStatus"
          >
            <el-option label="已售（自用）" value="已售（自用）"></el-option>
            <el-option label="已售（出租）" value="已售（出租）"></el-option>
            <el-option label="未售（出租）" value="未售（出租）"></el-option>
            <el-option label="未售（闲置）" value="未售（闲置）"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="stallStatus"
          label="选择业主:"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input
            :style="targetuser.name ? 'width:216px':'width:230px'"
            v-model="targetuser.name"
            :disabled="true"
            placeholder="请选择业主"
          ></el-input>
          <el-button @click="chooseOwner">{{targetuser.name ? '重新选择' :'请选择'}}</el-button>
        </el-form-item>

        <el-form-item label="车位类型:" prop="carSpaceTypeId">
          <el-select style="width:100%" v-model="createForm.carSpaceTypeId" placeholder="请选择">
            <el-option v-for="item in carStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注信息:" prop="note">
          <el-input
            type="textarea"
            v-model="createForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            @input="constraintLength(editForm.note,'200')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createStall">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 选择业主 -->
    <el-dialog
      class="dialog-rewrite"
      width="700px"
      title="选择业主"
      :visible.sync="dialogOwnerVisible"
      :before-close="ownerClose"
    >
      <div class="word-filter" style="margin-top:20px;">
        <div class="word-filter">
          <span class="filter-name">姓名:</span>
          <el-input
            class="input-filter"
            size="small"
            clearable
            v-model="filterUser.name"
            placeholder="请输入姓名"
          ></el-input>
        </div>

        <div class="word-filter">
          <span class="filter-name">电话:</span>
          <el-input
            class="input-filter"
            size="small"
            clearable
            v-model="filterUser.phone"
            placeholder="请输入电话"
          ></el-input>
        </div>

        <div class="word-filter">
          <span class="filter-name" style="width:150px">证件号码:</span>
          <el-input
            class="input-filter"
            size="small"
            clearable
            v-model="filterUser.idCard"
            placeholder="请输入证件号码"
          ></el-input>
        </div>

        <div class="word-filter">
          <el-button
            style="margin-left:20px;"
            type="primary"
            size="small"
            @click="searchUser(1)"
          >搜 索</el-button>
        </div>
      </div>
      <div style="margin-top:10px;">
        <div class="user-father">
          <div class="user-item" v-for="(item,index) in nameList" :key="'nameList' + index">
            <div>
              <span>{{item.name}}</span>
              <span>{{item.phone}}</span>
              <span>{{item.cardNo}}</span>
            </div>
            <el-button
              style="margin-left:20px;"
              type="primary"
              size="small"
              @click="chooseUser(item)"
            >选 择</el-button>
          </div>
        </div>
        <el-pagination
          background
          style="margin:10px 0"
          @current-change="searchUser"
          :page-size="listQuery.limit"
          :current-page="listQuery.page"
          layout="total, prev, pager, next, slot"
          :total="listQuery.total"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 修改车位 -->
    <el-dialog
      :close-on-click-modal="false"
      title="修改业主"
      :visible.sync="dialogEdit"
      width="500px"
      :before-close="editClose"
    >
      <el-form
        :model="editForm"
        ref="updateForm"
        label-width="100px"
        label-position="right"
        style="margin-right:40px;"
      >
        <el-form-item
          label="选择业主:"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input
            :style="targetuser.name ? 'width:216px':'width:230px'"
            v-model="targetuser.name"
            :disabled="true"
            placeholder="请选择业主"
          ></el-input>
          <el-button @click="chooseOwner">{{targetuser.name ? '重新选择' :'请选择'}}</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editClose">取 消</el-button>
        <el-button type="primary" @click="updateStall">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 业主详细信息 -->
    <el-dialog
      class="dialog-rewrite"
      width="650px"
      :title="'业主: '+ detailDialog.ownerName"
      :visible.sync="dialogFormVisible"
      :before-close="detailClose"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="详细信息" name="first">
          <el-form label-width="100px" v-model="ownerDetail" style="margin:20px 0;">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="姓名:">
                  <span>{{ownerDetail.name}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="性别:">
                  <span>{{ownerDetail.sex==='0' ? '女' : '男'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="电话:">
                  <span>{{ownerDetail.phone}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="证件类型:">
                  <span>{{ownerDetail.cardName}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="证件号码:">
                  <span>{{ownerDetail.cardNo}}</span>
                </el-form-item>
                <!-- <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{ownerDetail.note ? ownerDetail.note : "暂无"}}</span>
                </el-form-item>-->
                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <el-input
                    size="small"
                    @blur="confirmUpdateNoteUser(ownerDetail)"
                    maxlength="200"
                    v-model="ownerItem"
                    placeholder="编辑备注信息(最多输入200字)"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="通行记录" name="second">
          <el-table :data="dtailTable" style="width: 100%" border v-loading="dtailTableLoading">
            <el-table-column prop="ownerName" align="center" label="姓名" width="150px"></el-table-column>

            <el-table-column prop="carNo" align="center" label="车牌"></el-table-column>

            <el-table-column prop="inOut" align="center" label="进/出" width="60px"></el-table-column>

            <el-table-column
              prop="passTime"
              align="center"
              label="通行时间"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column width="100" align="center" label="抓拍图片">
              <template slot-scope="{row}">
                <div style="height:30px;">
                  <img :src="row.photos ? row.photos : ''" alt />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="getOwnerCarPass"
            :page-size="passListParams.limit"
            :current-page="passListParams.page"
            style="margin-top:10px;"
            background
            layout="prev, pager, next"
            :total="passListParams.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="车辆信息" name="third">
          <el-table :data="carDtailTable" style="width: 100%" border v-loading="dtailTableLoading">
            <el-table-column prop="carNo" align="center" label="车牌号"></el-table-column>
            <el-table-column prop="carType" align="center" label="车辆类型"></el-table-column>
            <el-table-column prop="modal" align="center" label="型号"></el-table-column>
            <el-table-column width="100" align="center" label="照片">
              <template slot-scope="{row}">
                <div style="height:30px;">
                  <img :src="row.photos ? row.photos : ''" alt />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="fetchCarList"
            :page-size="carDtailTableParams.limit"
            :current-page="carDtailTableParams.page"
            style="margin-top:10px;"
            background
            layout="prev, pager, next"
            :total="carDtailTableParams.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="房屋信息" name="five">
          <el-table
            :data="houseDtailTable"
            style="width: 100%"
            border
            v-loading="dtailTableLoading"
          >
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="serialNumber"
              label="房屋编号"
            >
              <template slot-scope="{row}">
                <span>{{ row.houseDetail.groupName }}{{row.houseDetail.groupName&&row.houseDetail.buildingName ?' - ' :''}}{{ row.houseDetail.buildingName}}{{row.houseDetail.buildingName&&row.houseDetail.serialNumber ?' - ':''}} {{ row.houseDetail.serialNumber}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="创建时间"
            ></el-table-column>

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
                <span>{{row.houseDetail.note}}</span>
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
                <div style="height:30px">
                  <el-button
                    size="small"
                    type="text"
                    @click="deleteHouse(scope.row, scope.$index)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
            @current-change="fetchOwnerHouse"
            :page-size="houseDtailTableParams.limit"
            :current-page="houseDtailTableParams.page"
            style="margin-top:10px;"
            background
            layout="prev, pager, next"
            :total="houseDtailTableParams.total"
          ></el-pagination>-->
        </el-tab-pane>
        <el-tab-pane label="人脸库信息" name="six">
          <el-table :data="faceList" border style="width: 100%" v-loading="dtailTableLoading">
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
                <div style="height:30px;">
                  <img :src="row.face ? row.face : ''" alt />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="fetchFaceList"
            :page-size="facePage.limit"
            :current-page="facePage.page"
            style="margin-top:10px;"
            background
            layout="prev, pager, next"
            :total="facePage.total"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 绑定车牌 -->
    <el-dialog
      class="dialog-rewrite"
      width="550px"
      title="绑定车辆"
      :visible.sync="dialogCarVisible"
      :before-close="bindingPlatesClose"
    >
      <el-form
        label-width="100px"
        label-position="right"
        style="margin-right:40px;"
        v-model="bindingcarnum"
      >
        <el-form-item style="margin-bottom:0" label="车位:" prop="carSpaceGroupName">
          <span>{{detailDialog.carSpaceGroupName}} {{detailDialog.serialNumber}}</span>
        </el-form-item>

        <el-form-item style="margin-bottom:14px" label="已绑车辆:" prop="bindCarName">
          <el-tag
            style="margin-left:5px"
            :key="index"
            v-for="(tag, index) in detailDialog.carSpaceVos"
            closable
            :disable-transitions="false"
            @close="deleteTag(tag,index)"
          >{{tag.carNo}}</el-tag>

          <el-tag
            style="margin-left:5px"
            type="info"
            v-for="(tag, index) in selectCarNo"
            :key="'selectCarNo' + index"
            closable
            :disable-transitions="false"
            @close="deleteTagInfo(tag)"
          >{{tag.name}}</el-tag>

          <el-select
            size="small"
            v-if="selectCar"
            v-model="bindingcarnum.carItem"
            filterable
            remote
            placeholder="请输入车牌号进行模糊查询"
            :disabled="carIdDisabled"
            :remote-method="remoteMethodCar"
            :loading="carLoading"
            @change="selectChange"
            @blur="selectBlur"
          >
            <el-option v-for="item in carnoList" :key="item.carId" :label="item.name" :value="item">
              <span style="float: left">{{ item.name }}</span>
              <span
                style="float: right; color: #8492a6; font-size: 13px"
              >{{item.ownerName}} {{ item. value }}</span>
            </el-option>
          </el-select>

          <el-button
            v-if="!carIdDisabled&&!selectCar"
            size="small"
            plain
            class="el-icon-plus"
            type="primary"
            @click="handeleCar()"
          ></el-button>
        </el-form-item>

        <!-- <el-form-item label="绑定车辆:" prop="carId"></el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindingPlatesClose">取 消</el-button>
        <el-button type="primary" @click="bindingcarnumBtn">绑 定</el-button>
      </span>
    </el-dialog>
    <!-- uploadUrl="/v1/admin/car-space/import" -->
    <ExportIn
      :uploadUrl="env === 'production' ? 'http://47.103.184.184/admin/car-space/import' : '/v1/admin/car-space/import'"
      downTemplateUrl="/admin/car-space/export"
      @closeVisible="closeVisible"
      TmplateName="车位导出模板.xlsx"
      @successUpload="fetchData(initForm)"
      :visible.sync="visible"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { sprintf } from "sprintf-js";
import {
  getHouseTreeData,
  // addHouse,
  // updateStatusNote,
  getStall, // 获取车位列表
  addStall, // 新增车位
  editStall, // 修改业主
  getOwnerUser, // 查看业主详情
  querycarno, // 查询车牌号
  addcarno, // 新增绑定车牌
  deleteCarno, // 删除车牌
  batchStall, //批量新增车位
  // getUserPropertyCar, //获取业主车辆
  carPassList //查询业主车辆通行记录
} from "@/api/carApi.ts";
import { getUser, getTargetHouse } from "@/api/vistorApi.ts"; //输入人名模糊查询人员
import { updateUserNote, getOwnerFaceList } from "@/api/peopleApi.ts";
import {
  getUnitList,
  addUnit,
  deleteUnit,
  deleteTheHousePeople
} from "@/api/houseApi.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("../carTree/index.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
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
    type(val: string) {
      const data = {
        "1": "业主",
        "2": "租户",
        "3": "家庭成员"
      };
      return data[val];
    },
    peopleStatus(val: string) {
      const data = {
        "0": "在住",
        "-1": "不在住",
        "-2": "过期"
      };
      return data[val];
    }
  }
})
export default class CardManage extends Vue {
  private rowSpan: any = {
    row1: 3,
    row2: 21
  };
  initForm: object = {
    url: "/admin/car-space/",
    method: "get"
  };
  filterForm: object = {
    ownerName: null, //姓名
    ownerPhone: null, //电话
    // cardName: null, //车牌号
    serialNumber: null, //车位编号
    status: [], //车位状态
    carSpaceTypeId: [], //车位类型
    carSpaceGroupId: "",
    isData: true //导出车位
  };
  deleteForm: object = {
    url: "/admin/car-space/batch-delete",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的车位,绑定的业主及车牌同时进行删除, 删除后车位将不存在,请谨慎操作!`
  };
  env: string = process.env.NODE_ENV;

  dialogAdds: Boolean = false; //批量添加车位状态
  private dialogOwnerVisible: Boolean = false; //选择业主弹出框
  batchForm: object = {
    carSpaceGroupId: "",
    carSpaceTypeId: "",
    end: "",
    start: "",
    status: "未售（闲置）"
  }; // 批量添加表单
  batchRules: object = {
    start: [{ required: true, message: "请输入开始编号", trigger: "blur" }],
    end: [{ required: true, message: "请输入结束编号", trigger: "blur" }],
    carSpaceTypeId: [
      { required: true, message: "请选择楼单位", trigger: "blur" }
    ]
  };
  private sample: Array<Object> = []; //生成示例

  private filterUser: Object = { name: "", phone: "", idCard: "" };
  private targetuser: Object = {}; //选中的业主
  private editItem: Object = {}; //保存初始需修改的目标信息

  private addDisabled: Boolean = true; //新增车位是否禁用 | 批量新增是否禁用
  private stallStatus: Boolean = false; //是否添加业主

  createForm: object = {
    ownerScenceUserId: "", // 业主场景用户id
    carSpaceGroupId: "", // 车位分组id
    carSpaceTypeId: "", // 车位类型id
    serialNumber: "", // 车位编号
    status: "", // 车位状态
    note: "" // 备注
  };
  rules: any = {
    name: [{ required: false, message: "请车位选择业主", trigger: "change" }],
    // carSpaceGroupId: [
    //   { required: true, message: "请选择车位所属分组", trigger: "change" }
    // ],
    carSpaceTypeId: [
      { required: true, message: "请选择车位类型", trigger: "change" }
    ],
    serialNumber: [
      { required: true, message: "请输入车位的编号", trigger: "blur" }
    ]
    // status: [{ required: true, message: "请选择车位状态", trigger: "change" }]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    name: "", // 业主场景用户id
    // carSpaceGroupId: "", // 车位分组id
    carSpaceTypeId: "", // 车位类型id
    serialNumber: "", // 车位编号
    status: "" // 车位状态
  };

  private carSpaceGroup: Object = {};
  private dialogEdit: Boolean = false; // 修改弹出表单
  private editForm: Object = {
    ownerScenceUserId: "", // 业主场景用户id
    // carSpaceGroupId: "", // 车位分组id
    carSpaceTypeId: "", // 车位类型id
    serialNumber: "", // 车位编号
    status: "", // 车位状态
    id: "", //目标id
    note: "" // 备注
  };
  private removeCarIds: Array<object> = []; //需要删除的车牌Id
  private ownerName: String = ""; //获取业主id

  TreeData: Array<Object> = []; // 树形结构数据
  tree_data: Object = {}; //目标树
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  updateArray: Array<string> = ["noteStatus", "houseStatus"];
  noteString: string = ""; // 修改的备注
  private dialogFormVisible: Boolean = false; //查看详细信息
  private dialogCarVisible: Boolean = false; //绑定车牌
  private selectCar: Boolean = false; //input与按钮切换
  private selectCarNo: Array<Object> = []; //选中的注册车牌
  private carIdItem: String = "";

  private detailDialog: Object = {
    //查看目标详情
    name: ""
  };
  private activeName: string = "first"; //目标车位详细信息 tab Title

  private nameList: Array<Object> = []; //人员
  private listQuery: Object = {
    // 关注人员目标通行记录翻页
    total: 0,
    limit: 7,
    page: 1
  };
  private loading: Boolean = false; //姓名模糊查询

  private carStatus: Array<Object> = []; //获取车位类型

  private ownerDetail: Object = {}; //业主信息
  private ownerItem: string = ""; //保存业主信息初始值note
  private dtailTableLoading: Boolean = true; //目标车位业主车辆通行记录状态
  private dtailTable: Array<Object> = []; //目标车位业主车辆通行记录
  private passList: Array<Object> = []; // 关注人员名单目标通行记录
  passListParams: object = {
    limit: 7,
    page: 1,
    ownerScenceUserId: ""
  };
  private carDtailTable: Array<Object> = []; //业主车辆信息
  carDtailTableParams: object = {
    limit: 7,
    page: 1,
    scenceUserId: ""
  };
  private houseDtailTable: Array<Object> = []; // 房屋信息
  houseDtailTableParams: object = {
    limit: 7,
    page: 1,
    id: ""
  };
  private faceList: Array<object> = []; // 人脸库列表
  facePage: object = {
    page: 1,
    limit: 7,
    scenceUserId: ""
  };

  private carnoList: Array<Object> = []; //车牌号
  private carIdDisabled: Boolean = false; // 是否允许绑定车牌
  private carLoading: Boolean = false; //车牌模糊查询
  private bindingcarnum: Object = { carItem: {}, carId: "", carIds: [] }; //绑定车辆

  private carStatusFilter: Array<Object> = [];

  visible: boolean = false; // 导入框状态
  private carType: Array<Object> = [
    //车辆类型筛选
    {
      label: "已售（自用）",
      value: "已售（自用）"
    },
    {
      label: "已售（出租）",
      value: "已售（出租）"
    },
    {
      label: "未售（出租）",
      value: "未售（出租）"
    },
    {
      label: "未售（闲置）",
      value: "未售（闲置）"
    }
  ];
  ComponentCommand(houseStatus: string, row: object) {
    return {
      ...row,
      houseStatus
    };
  }

  created() {
    this.getHouseTreeData(); // 获取tree data
    this.getSatll(); //获取新增时的车位类型
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  fetchDatas(obj: object) {
    /**@description 处理树结构回传事假 */
    const info = { ...obj["form"] };
    info.params["status"] = obj["status"];
    this.fetchData(info);
    this.addDisabled = obj["status"];
    this.carSpaceGroup = obj["carSpaceGroup"];
    this.tree_data = obj["tree_data"];
  }

  addstalls() {
    /**@description 批量添加车位 表单*/
    this.filterForm["isData"] = false;
    this.dialogAdds = true;
  }

  public phoneNum: any = 0;
  public regPos = /^\d+(\.\d+)?$/;
  public upNum = /[^\d]/g;
  public hintPhone: any = false;
  // 编号只可输入数字
  UpNumber(e: any) {
    var v = e.target.value;
    e.target.value = v.replace(this.upNum, "");
  }

  // 起止编号输入检测
  private housePartern = /^\d+$/;

  inputHouseCheck(e: any) {
    let v = e.target.value;

    if (!this.housePartern.test(e.target.value)) {
      this["message"]("error", "开始和结束为数值!");
      e.target.value = "";
    }
    // this.batchForm["start"] = this.batchForm["start"].toUpperCase();
    // this.batchForm["end"] = this.batchForm["end"].toUpperCase();
  }

  clearableBtn(v) {
    //清除
    this.phoneNum = v ? v.length : 0;
  }

  hintChange(v: any) {
    if (this.batchForm["start"] && this.batchForm["end"]) {
      this.changeSelect();
    }
    this.hintPhone = v ? true : false;
  }

  changeSelect() {
    /**@description 生成示例 */
    this.sample = [];
    if (!this.checkHouseInput()) {
      return;
    }

    let unitName = "";
    if (/^\d+$/.test(this.batchForm["start"])) {
      const zeroCount = this.batchForm["start"].search(/[1-9]/) + 1;
      for (
        let i = Number(this.batchForm["start"]);
        i <= Number(this.batchForm["end"]);
        i++
      ) {
        this.sample.push(sprintf(`%0${zeroCount}d${unitName}`, i));
      }
    }
  }

  checkHouseInput() {
    /**@description 检测子分组开始和结束规则 */
    if (/^0*$/.test(this.batchForm["start"])) {
      this.$message.error("请输入正整数");
      return false;
    }

    if (/^0{0,2}[1-9]\d*$/.test(this.batchForm["start"])) {
      if (!/^0{0,2}[1-9]\d*$/.test(this.batchForm["end"])) {
        this["message"]("error", "开始和结束的序号类型不一致!");
        // this.batchForm["carSpaceTypeId"] = "";
        return false;
      }
      if (Number(this.batchForm["start"]) > Number(this.batchForm["end"])) {
        this["message"]("error", "请确保序号由小到大!");
        // this.batchForm["unitId"] = "";
        return false;
      }

      return true;
    } else {
      return false;
    }
  }

  handleChangeBatch(arr) {
    /**@description 处理新增时选择的车位分组信息 */
    this.batchForm["carSpaceGroupId"] = [
      ...this.batchForm["carSpaceGroupId"]
    ].pop();
  }

  createStalls() {
    /**@description 批量添加车位 提交 */
    const form = {
      ...this.batchForm
    };
    form["carSpaceGroupId"] = this.carSpaceGroup["carSpaceGroupId"];
    this.$refs["batchForm"]["validate"](valid => {
      if (valid) {
        batchStall(form).then(res => {
          if (res.data.code === 200) {
            this["message"]("success", "批量添加车位成功!");
            this.initData();
            this["fetchData"](this.initForm);
            this.closeDialog();
          }
        });
      }
    });
  }

  closeDialog() {
    /**@description 关闭批量添加车位*/
    this.dialogAdds = false;
    this.targetuser = {};
    // this.carSpaceGroup = {};
    this.$refs["dataTree"]["handleNodeClick"](
      this.tree_data["data"],
      this.tree_data["node"]
    );
  }

  closeVisible(flag: boolean) {
    /**@description 导出状态 */
    this.visible = flag;
  }

  showExportIn() {
    /**@description 导出状态 */
    this.visible = true;
  }

  getHouseTreeData() {
    /**@description  获取tree data */
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
    });
  }

  searchUser(page: Number) {
    /**@description 根据不同条件查询业主 */
    this.listQuery["page"] = page;
    const info = { ...this.listQuery, ...this.filterUser };
    getUser(info).then(res => {
      this.loading = false;
      this.nameList = res.data.data.records.map(item => {
        return {
          phone: item.phone,
          name: item.name,
          ownerScenceUserId: item.id,
          cardNo: item.cardNo
        };
      });
      this.listQuery["total"] = res.data.data.total;
    });
  }

  chooseUser(item) {
    /**@description 选中目标业主 */
    this.targetuser = item;
    this.ownerClose();
  }

  async getSatll() {
    /**@description 获取新增时的车位类型 */
    const { data } = await getStall();
    this.carStatus = data.data;
    this.carStatusFilter = data.data;
  }

  handleChange(arr) {
    /**@description 处理新增时选择的车位分组信息 */
    this.createForm["carSpaceGroupId"] = [
      ...this.createForm["carSpaceGroupId"]
    ].pop();
  }

  selectStatus(val) {
    if (val == "已售（自用）" || val == "已售（出租）") {
      this.stallStatus = true;
    } else {
      this.stallStatus = false;
    }
  }

  chooseOwner() {
    /**@description 选择业主弹出框 */
    this.dialogOwnerVisible = true;
  }

  ownerClose() {
    /**@description 选择业主取消弹出框 */
    this.dialogOwnerVisible = false;
    this.filterUser = { name: "", phone: "", cardno: "" };
    this.nameList = [];
  }

  initData() {
    /**@description 初始化数据 */
    for (const key in this.filterForm) {
      this.filterForm[key] = null;
    }
    this["page"]["page"] = 1;
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  createStall() {
    /**@description  添加车位 */
    const form = {
      ...this.createForm
    };
    form["ownerScenceUserId"] = this.targetuser["ownerScenceUserId"];
    form["carSpaceGroupId"] = this.carSpaceGroup["carSpaceGroupId"];
    if (!form["ownerScenceUserId"]) {
      this.errorMessage["name"] = "请选择业主";
    }
    this.$refs["dataForm"]["validate"](valid => {
      if (valid) {
        addStall(form).then(res => {
          if (res.data.code === 200) {
            this["message"]("success", "添加车位成功!");
            this.initData();
            this["fetchData"](this.initForm);
            this.handleClose();
          }
        });
      }
    });
  }

  handleClose() {
    /** @description 关闭添加dialog */
    this["dialogCreate"] = false; //添加dialog
    for (const key in this.createForm) {
      this.createForm[key] = "";
    }

    this.getSatll();
    this.nameList = [];
    this.$nextTick(() => {
      //清空表单
      this.$refs["dataForm"]["resetFields"]();
    });
    this.targetuser = {};
    this.$refs["dataTree"]["handleNodeClick"](
      //重新触发树结构init方法
      this.tree_data["data"],
      this.tree_data["node"]
    );
    this.errorMessage["name"] = ""; // 取消错误提示信息
    this.stallStatus = false; //选择业主input是否显示
  }

  editStatus(val) {
    /**@description 单独修改车位状态 */
    this.editForm = val;
  }

  handleCommand(val) {
    /**@description 单独修改车位状态 事件 */
    if (val == "未售（闲置）") {
      this.$confirm(
        `将车位的类型改为${val},会把绑定的业主和车牌进行删除,是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.updateStatus(val);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
      return;
    }

    if (val == "未售（出租）") {
      this.$confirm(
        `将车位的类型改为${val},会把绑定的业主进行删除,是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.updateStatus(val);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
      return;
    }
    this.updateStatus(val);
  }

  updateStatus(val) {
    /**@description 单独修改车位状态 事件 */
    const form = { status: val, id: this.editForm["id"] };
    editStall(form).then(() => {
      this["message"](
        "success",
        `修改车位编号为${this.editForm["serialNumber"]}的状态成功!`
      );
      this["fetchData"](this.initForm);
    });
  }

  // batchDeleteCarNo() {
  //   /**@description 批量删除车牌 */
  //   for (const item of this.editForm["carSpaceVos"]) {
  //     this.removeCarIds.push(item["carId"]);
  //   }
  //   const form = { id: this.editForm["id"], removeCarIds: this.removeCarIds };
  //   editStall(form).then(() => {
  //     this["message"](
  //       "success",
  //       `修改编号为${this.editForm["serialNumber"]}的车位状态成功!`
  //     );
  //     this["fetchData"](this.initForm);
  //     this.removeCarIds = [];
  //   });
  // }

  handlEcarSpaceType(val) {
    /**@description 单独修改车位类型 事件 */
    const form = { carSpaceTypeId: val, id: this.editForm["id"] };
    editStall(form).then(() => {
      this["message"](
        "success",
        `修改车位编号为${this.editForm["serialNumber"]}的类型成功!`
      );
      this["fetchData"](this.initForm);
    });
  }

  editTarget(item) {
    /**@description 修改操作 */
    for (const key in this.editForm) {
      this.editForm[key] = item[key];
    }
    this.ownerName = item.ownerName;
    this.targetuser["name"] = item.ownerName;
    this.targetuser["ownerScenceUserId"] = item.ownerScenceUserId;
    this.editItem = item;
    // this.editForm["ownerScenceUserId"] = null;
    this.dialogEdit = true;
  }

  changeOwner() {
    /**@description 处理模糊查询的业主 */
    this.editForm["ownerScenceUserId"] = this.ownerName;
  }

  handleEdit(arr) {
    /**@description 处理修改时选择的车位分组信息 */
    this.editForm["carSpaceGroupId"] = [
      ...this.editForm["carSpaceGroupId"]
    ].pop();
  }

  updateStall() {
    /**@description 修改车位业主 */
    const form = { ...this.editForm };
    form["ownerScenceUserId"] = this.targetuser["ownerScenceUserId"];
    for (const key in form) {
      if (form[key] === "") {
        delete form[key];
      }
    }

    if (form["ownerScenceUserId"] !== this.editItem["ownerScenceUserId"]) {
      this.$refs["updateForm"]["validate"](valid => {
        if (valid) {
          editStall(form).then(() => {
            this["message"](
              "success",
              `将车位业主${
                this.editItem["ownerName"] ? this.editItem["ownerName"] : " "
              } 修改为 ${this.targetuser["name"]}成功!`
            );
            this.editClose();
            this["fetchData"](this.initForm);
          });
          return;
        }
      });
      return;
    }
    this["message"](
      "error",
      `注意: 没有发现你对车位业主${this.editItem["ownerName"]}进行了修改!`
    );
    this.editClose();
  }

  editClose() {
    /** @description 关闭修改dialog */
    this.dialogEdit = false;
    for (const key in this.errorMessage) {
      this.errorMessage[key] = "";
    }
    // this.$refs.dataTree["highlightStatus"] = true;
    this.$refs["updateForm"]["resetFields"]();
    this.targetuser = {};
    this.errorMessage["name"] = "";
    this.nameList = [];
  }

  // 修改备注自动获取焦点
  focusNoteInput(row) {
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  noteBlur(row) {
    /**@description 修改车位备注信息 */
    const form = { note: this.noteString, id: row.id };
    if (row["note"] !== form["note"]) {
      editStall(form)
        .then(res => {
          this["message"](
            "success",
            `修改车位编号为${row["serialNumber"]}的备注信息成功!`
          );

          this.fetchData(this.initForm);
        })
        .catch(() => {
          console.log("修改车位备注信息失败");
        });
    }
    this.noteString = "";
    row.noteStatus = false;
  }

  confirmUpdateNoteUser(row) {
    // if (!this.ownerDetail["note"]) {
    //   return this["message"]("error", "请输入业主的备注信息!");
    // }
    console.log(this.ownerDetail["note"], this.ownerItem);
    if (this.ownerDetail["note"] !== this.ownerItem) {
      updateUserNote(this.ownerDetail["id"], this.ownerItem).then(res => {
        if (res.data.code === 200) {
          this["message"](
            "success",
            `修改业主${this.ownerDetail["name"]}备注信息成功!`
          );
          this.noteString = "";
          this.fetchData(this.initForm);
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }

  async handleClick(tab) {
    /**@description 绑定车辆 */
    if (tab.name === "first") {
      this.getOwnerDetail(this.detailDialog);
    } else if (tab.name === "second") {
      this.getOwnerCarPass(1);
    } else if (tab.name === "third") {
      this.fetchCarList(1);
    } else if (tab.name === "five") {
      this.fetchOwnerHouse(1);
    } else if (tab.name === "six") {
      this.fetchFaceList(1);
    }
  }

  showHouseDetails(row) {
    /**@description 查看目标车位详情
     * @argument first 查询业主信息
     * @argument second 绑定车牌
     */
    // this.activeName = inviter;
    this.dialogFormVisible = true;
    this.getOwnerDetail(row);
    this.detailDialog = Object.assign({}, row);
    this.facePage["scenceUserId"] = row.ownerScenceUserId;
    this.passListParams["ownerScenceUserId"] = row.ownerScenceUserId;
    this.carDtailTableParams["scenceUserId"] = row.ownerScenceUserId;
    this.houseDtailTableParams["id"] = row.ownerScenceUserId;
  }

  detailClose() {
    /** @description 关闭详情diolog */
    this.dialogFormVisible = false; //车辆详情dialog
    this.activeName = "first";
    this.bindingcarnum = { carItem: {}, carId: "", carIds: [] };
    this.carnoList = [];
  }

  bindingPlates(row) {
    /**@description 绑定车牌 */
    this.dialogCarVisible = true;
    this.detailDialog = Object.assign({}, row);
    this.carIdDisabled =
      this.detailDialog["carSpaceVos"] &&
      this.detailDialog["carSpaceVos"].length === 6
        ? true
        : false;
  }

  async getOwnerDetail(row) {
    /**@description  查询业主信息*/
    const { data } = await getOwnerUser({ id: row.ownerScenceUserId });
    this.ownerDetail = data.data.user;
    this.ownerItem = data.data.user.note;
  }

  async getOwnerCarPass(page: number) {
    /**@description  获取目标业主的车辆通行记录*/
    this.dtailTableLoading = true;
    this.passListParams["page"] = page;
    const info = { ...this.passListParams };
    const { data } = await carPassList(info);
    this.dtailTable = data.data.records;
    this.passListParams["total"] = data.data.total;
    this.dtailTableLoading = false;
    console.log(data.data.records, "获取目标业主的车辆通行记录");
  }

  async fetchCarList(page: number) {
    /**@description  获取业主的车辆信息*/
    this.dtailTableLoading = true;

    this.carDtailTableParams["page"] = page;
    const info = { ...this.carDtailTableParams };
    const { data } = await querycarno(info);
    this.carDtailTable = data.data.records;
    this.carDtailTableParams["total"] = data.data.total;
    this.dtailTableLoading = false;
    console.log(this.carDtailTable, "获取业主的车辆信息");
  }

  async fetchOwnerHouse(page: number) {
    /**@description  查询目标车位业主的房屋信息*/
    this.dtailTableLoading = true;
    this.houseDtailTableParams["page"] = page;
    const info = { ...this.houseDtailTableParams };
    const { data } = await getTargetHouse(info);
    // this.houseDtailTableParams["total"] = data.total;
    this.houseDtailTable = data.data;
    this.dtailTableLoading = false;
    console.log(data.data, "查询目标车位业主的房屋信息");
  }

  deleteHouse(row, index) {
    /**@description  删除目标车位的业主的某个房屋*/
    const text = `${this.detailDialog["ownerName"]} 位于 ${
      row.houseDetail.groupName ? row.houseDetail.groupName : ""
    }${row.houseDetail.groupName && row.houseDetail.buildingName ? " - " : ""}${
      row.houseDetail.buildingName
    }${
      row.houseDetail.buildingName && row.houseDetail.serialNumber ? " - " : ""
    }${row.houseDetail.serialNumber} 的房屋`;
    this.$confirm(`此操作将永久删除${text}的房屋, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteTheHousePeople(
          row.houseId,
          " ",
          this.houseDtailTableParams["id"]
        ).then(res => {
          if (res.data.code === 200) {
            this["message"]("success", `成功删除${text}的房屋!`);
            this.houseDtailTable.splice(index, 1);
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  async fetchFaceList(page: number) {
    /**@description  获取人脸库列表*/
    this.dtailTableLoading = true;
    this.facePage["page"] = page;
    const { data } = await getOwnerFaceList(this.facePage);
    console.log(data.data, "获取人脸库列表");
    this.facePage["total"] = data.total;
    this.faceList = data.data;
    this.dtailTableLoading = false;
  }

  async remoteMethodCar(query) {
    /**@description 根据车牌模糊查询车牌号 */
    if (query !== "") {
      this.loading = true;
      setTimeout(() => {
        if (query.length >= 1) {
          this.getCarno(query);
        }
      }, 200);
    } else {
      this.nameList = [];
    }
  }

  getCarno(query) {
    /**@description 获取车牌列表 */
    querycarno({ carNo: query, page: 1, limit: 10 }).then(res => {
      this.carLoading = false;
      this.carnoList = res.data.data.records.map(item => {
        return {
          value: item.ownerPhone,
          name: item.carNo,
          carId: item.id,
          ownerName: item.ownerName
        };
      });
    });
  }

  selectChange() {
    /**@description 选中车牌 */
    // this.selectCarNo = [];
    this.selectCar = false;
    for (const item of this.selectCarNo) {
      if (item["carId"] === this.bindingcarnum["carItem"]["carId"]) {
        this["message"](
          "success",
          `注意: 车牌号 ${this.bindingcarnum["carItem"]["name"]}已存在, 请重新选择!`
        );
        return;
      }
    }
    this.selectCarNo.push(this.bindingcarnum["carItem"]);
    this.bindingcarnum["carIds"] = [];
    this.selectCarNo.map(item => {
      this.bindingcarnum["carIds"].push(item["carId"]);
    });

    const selectLength = this.selectCarNo ? this.selectCarNo.length : 0;
    const carLength = this.detailDialog["carSpaceVos"]
      ? this.detailDialog["carSpaceVos"].length
      : 0;
    this.carIdDisabled = selectLength + carLength === 6 ? true : false;
    this.bindingcarnum["carItem"] = {};
    this.carnoList = [];
  }

  selectBlur() {
    // this.selectCar = false;
  }

  handeleCar() {
    /**@description 搜索车牌 */
    this.selectCar = true;
  }

  bindingcarnumBtn() {
    /**@description 绑定车牌 */
    const form = {
      id: this.detailDialog["id"],
      carIds: this.bindingcarnum["carIds"]
    };
    addcarno(form).then(res => {
      this["fetchData"](this.initForm);
      this.selectCarNo = [];
      this.bindingPlatesClose();
      this["notify"]("success", "成功", "绑定车牌成功");
    });
  }

  deleteTagInfo(val) {
    /**@description 删除选中的值 */
    for (const index in this.selectCarNo) {
      if (this.selectCarNo[index]["carId"] === val["carId"]) {
        this.bindingcarnum["carIds"].splice(Number(index), 1);
        this.selectCarNo.splice(Number(index), 1);
      }
    }
    // console.log(
    //   this.bindingcarnum["carIds"],
    //   789,
    //   this.selectCarNo[index]["carId"]
    // );
  }

  deleteTag(tag, index) {
    /**@description 删除绑定车牌 */
    const form = { id: this.detailDialog["id"], removeCarIds: [tag.carId] };
    this.$confirm("此操作将永久删除该车牌, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteCarno(form).then(res => {
          if (res.data.code === 200) {
            this["fetchData"](this.initForm);
            this.detailDialog["carSpaceVos"].splice(index, 1);
            this["notify"]("success", "成功", "绑定车牌删除成功");
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  bindingPlatesClose() {
    this.dialogCarVisible = false; //车牌绑定dialog
    this.activeName = "first";
    this.bindingcarnum = { carItem: {}, carId: "", carIds: [] };
    this.carnoList = [];
    this.selectCarNo = [];
    this.selectCar = false;
  }

  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan.row1 === 3) {
      this.rowSpan = {
        row1: 0,
        row2: 24
      };
    } else {
      this.rowSpan = {
        row1: 3,
        row2: 21
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .rightContent {
    flex: 1;
  }
}

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -10px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -11px;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
}
.user-father {
  height: 288px;
  border: 1px solid #dcdfe6;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  border-bottom: 1px solid #dcdfe6;
}
</style>
