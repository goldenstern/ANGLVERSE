<template>
  <div class="cont noselect" :class="{loaded: state.isLoggedIn && state.user.balance_ngls !== null}">
    <div class="wall-c" :class="{active: !walletActive}" @click="closemenu">
      <div class="header" style="position: absolute;">
        <div class="back-b" @click="wallet">
          <img style="width: 70px;" src="@/assets/gaika2.svg">
        </div>
      </div>
      <div class="sw-t opaque" :class="{disabled: !isTutorial3}">
        <img :class="{disabled: !(isTutorial3)}" src="@/assets/swipe2.png">
      </div>
      <div class="tot-b" style="z-index: 10;">
        <!-- <div class="wall-h" style="z-index: 202;">
          <span style="font-size:55px">{{state.name}}'s Wallet</span><br><span style="font-size: 55px;line-height: 60px;" class="yld">0.000576BNB</span>
        </div>
         -->
        <!-- <img style="position: absolute;left: 10%;top: 0px;width: 300px;margin-left: -50px;transform: scaleX(1);" class="egg" :src="getSkinUrl(state.skin_id)"> -->
        <investor style="position: absolute;left:-70px;top:70px" :skin-id="state.user.investor_skin_id"></investor>

        <div class="wall-h" style="margin-top: 40px;z-index: 202;text-align: right;right: -20px; position: relative;">
          <span style="font-size:55px">{{state.user.name}}'s Purse</span>
          <br>
          <span class="yld" style="font-size:85px">{{state.user.balance_ngls | formatCoin}}<img style="width:43px" class="cash" src="@/assets/Vector.png"></span>
          <br>
          <span class="yld" style="font-size:55px">{{parseFloat(state.user.balance_busd).toFixed(2)}}<img class="cash" src="@/assets/VectorBusd.png"> / </span>
          <span class="yld" style="font-size:55px">{{parseFloat(state.user.balance_bnb).toFixed(4)}}<img class="cash" src="@/assets/VectorBnb.png"> / </span> 
          <span class="yld" style="font-size:55px">{{parseFloat(tokenAmount).toFixed(0)}}<img class="cash" src="@/assets/VectorDAO.png"></span>
          <br>
          <span v-if="isCopying" @click="copywallet" style="font-size: 55px;max-width: 520px;text-align: left;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;position: relative;padding-right: 60px;color: rgb(229, 196, 79);width: 100%;line-height: 70px;">
            Copied...&nbsp;
            <img src="@/assets/copy.svg" style="width: 40px;z-index: 1000;position: absolute;right: 20px;top: 10px;">
          </span>
          <span v-else-if="state.user.start_gas && state.user.start_pack" @click="copywallet" style="font-size: 55px;max-width: 520px;text-align: left;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;position: relative;padding-right: 60px;color: rgb(229, 196, 79);line-height: 70px;">
              {{state.wallet.address}}
            <img src="@/assets/copy.svg" style="width: 40px;z-index: 1000;position: absolute;right: 20px;top: 10px;">
          </span>
          <span v-else @click="activatewallet" style="font-size: 55px;max-width: 520px;text-align: left;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;position: relative;padding-right: 60px;color: #ff8ee4;line-height: 70px;">Invoke Mastership</span>
        </div>
        <div style="width:100%;margin-top: 20px;">
          <div style="width: 100%;height: 5px; background: black;">
            <div :style="{'width': (state.user.xp * 100 / state.user.next_level_xp) + '%' }" style="height: 5px; background: #e5c44f;transition: width 1.5s ease;"></div>
          </div>
          <div v-if="state.user.level == 1" style="font-size:46px;font-family: Roboto;font-weight: 300;text-align: left;position: absolute;">LVL {{state.user.level}} Adept </div>
          <div v-if="state.user.level == 2" style="font-size:46px;font-family: Roboto;font-weight: 300;text-align: left;position: absolute;">LVL {{state.user.level}} Apprentice </div>
          <div v-if="state.user.level == 3" style="font-size:46px;font-family: Roboto;font-weight: 300;text-align: left;position: absolute;">LVL {{state.user.level}} Master </div>
          <div v-if="state.user.level == 4" style="font-size:46px;font-family: Roboto;font-weight: 300;text-align: left;position: absolute;">LVL {{state.user.level}} Magister </div>
          <div style="font-size:46px;font-family: Roboto;font-weight: 300;text-align: right;">{{state.user.xp}} XP / {{state.user.next_level_xp}} XP</div>
        </div>
        <!-- <div style="margin-top:30px;font-size: 32px;">{{state.wallet.address}}</div> -->
        <div class="d-w-b" style="margin-top:20px;overflow: hidden;height: 70px;overflow: visible;width: calc(100% + 160px);margin-left: -80px;">
          <div @click="send" style="background: white;width: calc(50% - 50px);height: 70px;line-height: 60px;border-color: #e5c44f;">Send Coins</div>
          <div @click="exchange" style="background: white;width: calc(50% - 50px);margin-left: 20px;height: 70px;line-height: 60px;">GSCB Exchange</div>
        </div>
        <!-- <h2>
          Ref link: {{state.user.ref_link}}
        </h2>
        <h3>
          Ref code: {{state.user.ref_code}}
        </h3>  -->
        <!-- <div style="margin-top: 80px;font-weight:300">
          <div :style="{ bottom: (538 + 100 * ((Math.max(egval/(100),1)-1)/4 + 1)  + 'px!important')}" style="display: inline-block;font-size: 55px;margin-right: 5px;">⥯ <span :class="{'win': convertToBnb(state.playerStats.saldo) > 0, 'lose': convertToBnb(state.playerStats.saldo) < 0}">{{convertToBnb(state.playerStats.saldo)}}</span></div><br>
          <span style="font-size: 30px;">Owned Eidols Value in Last Month</span>
        </div> -->
        <div style="display: block;position: inherit;margin-top: 20px;">
          <div v-if="typeSelected == 'item'" class="w-i-2" style="position: absolute;z-index: 202;top:0;pointer-events: none;">
            <span v-if="state.oogles.length != 0 && state.oogles.length < state.user.level" style="text-transform: capitalize;">{{state.items[state.game.currentOogleIdx- (state.oogles.length == 0 ? 2 : state.oogles.length + 1)].name}} <span style="text-transform: initial;" v-if="state.items[state.game.currentOogleIdx- (state.oogles.length == 0 ? 2 : state.oogles.length + 1)].quantity > 1">x{{state.items[state.game.currentOogleIdx- (state.oogles.length == 0 ? 2 : state.oogles.length + 1)].quantity}}</span></span>
            <span v-else style="text-transform: capitalize;">{{state.items[state.game.currentOogleIdx- (state.oogles.length == 0 ? 1 : state.oogles.length)].name}} <span style="text-transform: initial;" v-if="parseInt(state.items[state.game.currentOogleIdx- (state.oogles.length == 0 ? 1 : state.oogles.length)].quantity) > 1">x{{state.items[state.game.currentOogleIdx- (state.oogles.length == 0 ? 1 : state.oogles.length)].quantity}}</span></span>
          </div>
          <div v-if="typeSelected == 'eidol' && state.oogles[state.game.currentOogleIdx]" class="w-i-2" style="position: absolute;z-index: 202;top:0;pointer-events: none;">
            <span style="text-transform: capitalize;">{{state.oogles[state.game.currentOogleIdx].rarity}} {{state.oogles[state.game.currentOogleIdx].skin.collection}} Eidol<img class="cash" src="@/assets/Vector.png"></span>
            <br>
            <span class="yld">{{convertToBnb(state.oogles[state.game.currentOogleIdx].value)}}<span v-if="parseFloat(state.oogles[state.game.currentOogleIdx].value) > parseFloat(state.oogles[state.game.currentOogleIdx].maxValue)"> / </span>
            <span class="lose" v-if="parseFloat(state.oogles[state.game.currentOogleIdx].value) > parseFloat(state.oogles[state.game.currentOogleIdx].maxValue)" style="font-size: 46px;">{{convertToBnb(state.oogles[state.game.currentOogleIdx].maxValue)}}</span></span>
            <br>
            <span v-if="parseFloat(state.playerStats.diffs[state.oogles[state.game.currentOogleIdx].id]) > 0" style="font-size: 46px;" class="">
              <abbr>{{(state.options.chart_size == 168) ? '7d' : state.options.chart_size + 'h'}}</abbr> <abbr style="color: rgb(229, 196, 79);">▲</abbr> {{convertToBnb(state.playerStats.diffs[state.oogles[state.game.currentOogleIdx].id])}}</span>
            <span v-if="parseFloat(state.playerStats.diffs[state.oogles[state.game.currentOogleIdx].id]) < 0" style="font-size: 46px;" class="">
               <abbr>{{(state.options.chart_size == 168) ? '7d' : state.options.chart_size + 'h'}}</abbr> <abbr style="color: #ff8ee4;">▼</abbr> {{convertToBnb(state.playerStats.diffs[state.oogles[state.game.currentOogleIdx].id]*-1)}}</span>
          </div>
          <div v-if="typeSelected == 'eidol'" class="w-i" style="z-index: 202;top:0;pointer-events: none;">
            <span>&nbsp;</span><br>
            <span
              v-bind:key="idx"
              v-for="(winlose, idx) in state.stats[state.game.currentOogleIdx]"
              :class="{'win': winlose > 0, 'lose': winlose < 0, 'yld': idx==0}"
              :style="{'opacity': (1 - 0.20*idx), 'font-size': (idx==0)?'inherit':'46px'}"
              >
                {{convertToBnb(winlose)}}
              <br>
            </span>
          </div>
          <div v-if="typeSelected == 'shop'" class="w-i-2" style="position: absolute;z-index: 202;top:0;pointer-events: none;">
            <span style="text-transform: capitalize;">Mage Shop</span>
          </div>
          <div v-if="typeSelected == 'forum'" class="w-i-2" style="position: absolute;z-index: 202;top:0;pointer-events: none;">
            <span style="text-transform: capitalize;">GoldenState Forum</span>
          </div>
          <div v-if="typeSelected == 'ref'" class="w-i-2" style="position: absolute;z-index: 202;top:0;pointer-events: none;">
            <span style="text-transform: capitalize;">GoldenState Community Notice</span>
          </div>
        </div>
        
      </div>
      <div class="bot-h">
        <div class="angl-c">
          <swiper
            style="bottom: 0;position: absolute;width: 100%;height:100%"
            ref="mySwiper"
            :slides-per-view="1"
            :pagination="{
              type: 'progressbar',
            }"
            :space-between="50"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            :options="swiperOptions"
            >

            <swiper-slide class="slide" v-for="(oogle, idx) in state.oogles" :key="oogle.id">
              <ogle :oogle-id="oogle.id" :value="parseFloat(state.oogles[idx].value)"></ogle>
            </swiper-slide>

            <swiper-slide class="slide" v-if="state && state.oogles && state.oogles.length == 0 && !(state.game.isReload && isIgnition) ">
              <ogle :manual="{'collection':'basic','type':'egg','rarity':'common','skin':'0.svg','scale':1}"></ogle>
            </swiper-slide>

            <swiper-slide class="slide" v-if="state && state.oogles && state.oogles.length > 0 && state.oogles.length < state.user.level && !(state.game.isReload && isIgnition) ">
              <ogle :manual="{'collection':'basic','type':'egg','rarity':'common','skin':'0.svg','scale':1}"></ogle>
            </swiper-slide>

            <swiper-slide class="slide" v-for="(item) in state.items" :key="item.id">
              <item v-if="(item.image && item.data && item.data.size)" :manual="{'path':item.image,'scale':item.data.size}"></item>
              <item v-else-if="item.image" :manual="{'path':item.image,'scale':2}"></item>
            </swiper-slide>

            <swiper-slide class="slide">
              <img style="bottom: 0px;width: 920px;margin-left: 250px;" src="@/assets/misc/stand.svg">
            </swiper-slide>

            <swiper-slide class="slide">
              <img style="height: 740px;position: absolute;margin-right: -500px;right: 0;" src="@/assets/misc/forum1.png">
            </swiper-slide>
            <!-- <swiper-slide class="slide">
              <ogle :manual="{'collection':'basic','type':'clanowner','rarity':'common','skin':'1.svg','scale':8}"></ogle>
              <img src="@/assets/CLANOWNER.png" style="width: 70%;position: absolute;bottom: 0;margin: 15% 15%;">
            </swiper-slide> -->
            <swiper-slide class="slide">
              <!-- <item :manual="{'path':'basic/item/Indulgence.png','scale':1.5}"></item> -->
              <!-- <img src="@/assets/ref.png" style="width: 90%;position: absolute;bottom: 0;margin: 0% 5% 10%;"> -->
              <img style="width: 600px;position: relative;margin: auto;margin-bottom: 0;" src="@/assets/scroll3.png">
            </swiper-slide>

          </swiper>
          
          <div :class="{losei: state.oogles[state.game.currentOogleIdx] && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id] && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null) && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null) && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null).type == 'bet' && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null).game_id == state.game.id - 1 && (!state.riskChanged[state.oogles[state.game.currentOogleIdx].id] || state.riskChanged[state.oogles[state.game.currentOogleIdx].id] != state.game.id)}" class="w-i" style="z-index: 202;pointer-events: none;" v-if="state.oogles[state.game.currentOogleIdx] && state.playerStats.rawcharts">
            <span>Emanate / Risk
              <span v-if="state.oogles[state.game.currentOogleIdx] && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id] && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null) && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null) && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null).zone == 'bot' && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null).game_id == state.game.id - 1">↑</span>
              <span v-if="state.oogles[state.game.currentOogleIdx] && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id] && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null) && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null) && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null).zone == 'top' && state.playerStats.rawcharts[state.oogles[state.game.currentOogleIdx].id].find(el => el.game_id != null).game_id == state.game.id - 1">↓</span>
            </span>
            <br>
            <span>
              {{((1/Math.cos(utils.m2a(state.oogles[state.game.currentOogleIdx].multiplier)/180*Math.PI) - 1)*100).toFixed(state.oogles[state.game.currentOogleIdx].data.precise + (state.oogles[state.game.currentOogleIdx].data.apple && new Date(state.oogles[state.game.currentOogleIdx].data.apple.replace(' ', 'T')) > new Date() ? 1 : 0))}}%
            </span>
          </div>
<!--           <div class="w-i-2" style="z-index: 202;pointer-events: none;">
            <span>My Deck</span><br>
            <span>
              <div class="swiper-pagination"></div>
            </span>
          </div> -->
          
          <div class="swiper-pagination-line home" style=""></div>
        </div>
        <div class="d-w-b" v-if="state.oogles.length == 0">
          <div v-if="state && !state.game.id">Fetching Aeon Data...</div>
          <div v-else-if="state && state.game.currentOogleIdx == 0" @click="goBuy">Buy Eidol Egg</div>
          <div v-else-if="typeSelected == 'shop'" @click="goBuy">Enter Mage Shop</div>
          <div v-else-if="typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Indulgence'" @click="goBuy">Buy Extra Eidol</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Cooptoken')" @click="gdao">Spend at GoldenState Community Store</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Scribe')" @click="goForum">Scribe Verse at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Tax')" @click="goForum">Claim Title at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Incense')" @click="goForum">Burn Incense at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Map')" @click="goForum">Send Caravan from GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Puff')" @click="goForum">Seek Wisdon at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Extract')" @click="goExtract">Extract Eidol</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Coincookie')" @click="goFeed">Feed Eidol</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-1] && state.items[state.game.currentOogleIdx-1].type == 'Apple')" @click="goApple">Feed Eidol</div>
          <div v-else-if="typeSelected == 'forum'" @click="goForum">Enter GoldenState Forum</div>
          <div v-else-if="typeSelected == 'ref'" @click="ref">View GoldenState Community Notice</div>
          <!-- <div v-if="state.game.currentOogleIdx - (state.oogles.length) == 2" @click="winco"><img style="transform: scale(-1,1);" src="@/assets/ogle.png"> Win a Clan Öwner</div> -->
        </div>
        <div class="d-w-b" v-else-if="state.oogles.length != 0 && state.oogles.length < state.user.level">
          <div class="locked-button" v-if="typeSelected == 'eidol' && state.oogles[state.game.currentOogleIdx].is_locked">Completing transaction...</div>
          <div v-else-if="typeSelected == 'eidol'" @click="goOgle">Manage Eidol</div>
          <div v-else-if="typeSelected == 'extra' || (typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length - 1] && state.items[state.game.currentOogleIdx-state.oogles.length - 1].type == 'Indulgence')" @click="goBuy">Buy Extra Eidol</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length - 1] && state.items[state.game.currentOogleIdx-state.oogles.length - 1].type == 'Cooptoken')" @click="gdao">Spend at GoldenState Community Store</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length - 1] && state.items[state.game.currentOogleIdx-state.oogles.length - 1].type == 'Scribe')" @click="goForum">Scribe Verse at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Tax')" @click="goForum">Claim Title at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Incense')" @click="goForum">Burn Incense at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Map')" @click="goForum">Send Caravan from GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Puff')" @click="goForum">Seek Wisdon at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Extract')" @click="goExtract">Extract Eidol</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Coincookie')" @click="goFeed">Feed Eidol</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Apple')" @click="goApple">Feed Eidol</div>
          <div v-else-if="typeSelected == 'shop'" @click="goBuy">Enter Mage Shop</div>
          <div v-else-if="typeSelected == 'forum'" @click="goForum">Enter GoldenState Forum</div>
          <div v-else-if="typeSelected == 'ref'" @click="ref">View GoldenState Community Notice</div>
          <!-- <div v-if="state.game.currentOogleIdx - (state.oogles.length-1) == 2" @click="winco"><img style="transform: scale(-1,1);" src="@/assets/ogle.png"> Win a Clan Öwner</div> -->
        </div>
        <div class="d-w-b" v-else>
          <div class="locked-button" v-if="typeSelected == 'eidol' && state.oogles[state.game.currentOogleIdx].is_locked">Completing transaction...</div>
          <div v-else-if="typeSelected == 'eidol'" @click="goOgle">Manage Eidol</div>
          <div v-else-if="typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Indulgence'" @click="goBuy">Buy Extra Eidol</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Cooptoken')" @click="gdao">Spend at GoldenState Community Store</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Scribe')" @click="goForum">Scribe Verse at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Tax')" @click="goForum">Claim Title at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Incense')" @click="goForum">Burn Incense at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Map')" @click="goForum">Send Caravan from GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Puff')" @click="goForum">Seek Wisdom at GoldenState Forum</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Extract')" @click="goExtract">Extract Eidol</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Coincookie')" @click="goFeed">Feed Eidol</div>
          <div v-else-if="(typeSelected == 'item' && state.items[state.game.currentOogleIdx-state.oogles.length] && state.items[state.game.currentOogleIdx-state.oogles.length].type == 'Apple')" @click="goApple">Feed Eidol</div>
          <div v-else-if="typeSelected == 'shop'" @click="goBuy">Enter Mage Shop</div>
          <div v-else-if="typeSelected == 'forum'" @click="goForum">Enter GoldenState Forum</div>
          <div v-else-if="typeSelected == 'ref'" @click="ref">View GoldenState Community Notice</div>
          <!-- <div v-if="state.game.currentOogleIdx - (state.oogles.length-1) == 2" @click="winco"><img style="transform: scale(-1,1);" src="@/assets/ogle.png"> Win a Clan Öwner</div> -->
        </div>
        <div class="ctdwn" style="pointer-events: none;">
          <div v-if="!state.game.isLocked">Next Crypto Aeon Block in</div>
          <div style="color:#ff8ee4" v-else><span v-if="state.game.isReload">Starting new Crypto Aeon</span><span v-else>Mining Crypto Aeon Block</span></div>
          <div :class="{locked: state.game.isLocked}" class="clock">{{state.game.timeToEnd}}</div>
        </div>
      </div>
      
    </div>
    <!-- <div class="sw-t opaque" :class="{disabled: !isTutorial && !state.game.isLocked && state.level != -1}">
      <img :class="{disabled: !(isTutorial && state.level != -1) || state.game.isLocked}" src="@/assets/swipe.png">
      <img :class="{disabled: !state.game.isLocked}" src="@/assets/lock.png">
      <img :class="{disabled: state.level != -1 || (state.isLoggedIn && state.level && state.level != -1) || state.game.isLocked }" src="@/assets/egg.png">
    </div> -->
    <div class="noselect" style="text-align: left;width: 100%;height: 100%;padding: 80px;background: white;">
      <img style="max-width: 250px;max-height: 250px;margin-bottom: 80px;display: inline-block;" src="@/assets/CIRKUL.png">
      <div class="left-menu-text">
        <a target="_blank" @click="onboard()"><span style="pointer-events: none;" class="noselect">About AnglVerse</span></a>
      </div>
      <div class="left-menu-text">
        <a target="_blank" href="https://t.me/AnglVerse_Support_bot"><span style="pointer-events: none;" class="noselect">Help And Support</span></a>
      </div>
      <br><br>
      <div class="left-menu-text">
        <a target="_blank" href="https://angl.money/"><span style="pointer-events: none;" class="noselect">Website</span></a>
      </div>
      <div class="left-menu-text">
        <a target="_blank" href="https://t.me/anglverse"><span style="pointer-events: none;" class="noselect">News Board</span></a>
      </div>
      <div class="left-menu-text">
        <a target="_blank" href="https://t.me/goldenstate_forum"><span style="pointer-events: none;" class="noselect">Community Chat</span></a>
      </div>
<!--       <div class="left-menu-text">
        Whitepaper
      </div>
      <div class="left-menu-text" @click="getCoin">
        Get Test Coins
      </div> -->
      <div @click="logout" style="bottom: 40px;position: absolute;" class="left-menu-text">
        <span class="noselect" style="pointer-events: none;">Logout</span>
      </div>
    </div>
  </div>
</template>

<script>
// Здесь JS
import axios from 'axios'
import state from '../store/state'
import config from '../config'
import utils from '../utils'
import router from '../router'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import Investor from '../components/Investor.vue'
import Ogle from '../components/Ogle.vue'
import Item from '../components/Item.vue'

// import style (<= Swiper 5.x)
import 'swiper/css/swiper.css'

// import Vue3TouchEvents from 'vue3-touch-events'

function col2rgb(color) {
    return [(color&0xFF0000)>>16, (color&0xFF00)>>8, color&0xFF];
}

const firstColor = 0xFFFFFF;
const secondColor = 0x00FFE0;
const thirdColor = 0xff0099;
const [r1, g1, b1] = col2rgb(firstColor)
const [r2, g2, b2] = col2rgb(secondColor)
const [r3, g3, b3] = col2rgb(thirdColor)
const MinAngle = 0.0;
const MaxAngle = 90.0;

export default {
  data: () => ({
    utils,
    state,
    activity_state: 'idle',
    currentAnimId: null,
    touchStartX: null,
    touchStartY: null,
    moveStart: false,
    expectedYield: 0.0,
    originalAngle: 0,
    uiColor: null,
    angle: 0.0,
    deposit: 0.0,
    rdy: false,
    lng: 0,
    isTutorial: !JSON.parse(window.localStorage.getItem('tutorial-done')),
    isTutorial2: !JSON.parse(window.localStorage.getItem('tutorial2-done')),
    isTutorial3: !JSON.parse(window.localStorage.getItem('tutorial3-done')),
    touchPriority: false,
    timer: null,
    walletActive: false,
    depActive: false,
    withActive: false,
    dwCounter: 0.0,
    origCounter: null,
    isSuccessDW: false,
    size: 1,
    selectEgg: 1,
    maxEgg: 4,
    isCopying: false,
    depLock: false,
    swiperOptions: {
      // pagination: {
      //   el: '.swiper-pagination',
      //   type: 'custom', //fraction
      //   renderCustom: function (swiper, current, total) {
      //     return current + '/' + total;
      //   },
      // },
      pagination: {
        el: '.swiper-pagination-line',
        type: 'bullets',
      },
      onInit: function (swiper) {
        swiper.slideTo(state.game.currentOogleIdx)
      },
      initialSlide: state.game.currentOogleIdx//state.game.currentOogleIdx
      // Some Swiper option/callback...
    }
  }),
  components: {
    Swiper,
    SwiperSlide,
    Investor,
    Ogle,
    Item
  },
  directives: {
      swiper: directive
  },
  computed: {
    tokenAmount() {
      let found = this.state.items.find(element => element.id == 4);
      if (found) {
        return found.quantity
      } else {
        return 0;
      }

    },
    typeSelected () {
      if (state.oogles.length == 0) {
        if ( state.game.currentOogleIdx <= state.oogles.length ) return 'eidol'
        if ( state.game.currentOogleIdx > state.oogles.length && state.game.currentOogleIdx <= state.oogles.length + state.items.length ) return 'item'
        if ( state.game.currentOogleIdx - (state.oogles.length + state.items.length) == 1 ) return 'shop'
        if ( state.game.currentOogleIdx - (state.oogles.length + state.items.length+1) == 1 ) return 'forum'
        return 'ref'
      }  else if (state.oogles.length != 0 && state.oogles.length < state.user.level) {
        if ( state.game.currentOogleIdx+1 <= state.oogles.length ) return 'eidol'
        if ( state.game.currentOogleIdx+1 > state.oogles.length && state.game.currentOogleIdx+1 <= state.oogles.length + 1 ) return 'extra'
        if ( state.game.currentOogleIdx+1 > state.oogles.length + 1 && state.game.currentOogleIdx+1 <= state.oogles.length + 1 + state.items.length ) return 'item'
        if ( state.game.currentOogleIdx - (state.oogles.length+state.items.length) == 1 ) return 'shop'
          if ( state.game.currentOogleIdx - (state.oogles.length + state.items.length+1) == 1 ) return 'forum'
        return 'ref'    
      }else {
        if (state.items.length > 0) {
            //console.log("CASE31")
            if ( state.game.currentOogleIdx+1 <= state.oogles.length ) return 'eidol'
            if ( state.game.currentOogleIdx+1 > state.oogles.length && state.game.currentOogleIdx+1 <= state.oogles.length + state.items.length ) return 'item'
            if ( state.game.currentOogleIdx - (state.oogles.length+state.items.length) == 0 ) return 'shop'
            if ( state.game.currentOogleIdx - (state.oogles.length+state.items.length+1) == 0 ) return 'forum'
            return 'ref'  
        } else {
            if ( state.game.currentOogleIdx+1 <= state.oogles.length ) return 'eidol'
            if ( state.game.currentOogleIdx - (state.oogles.length ) == 0 ) return 'shop'
             if ( state.game.currentOogleIdx - (state.oogles.length + 1) == 0 ) return 'forum'
            return 'ref'  
        }
          
      }
    },
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
    pWith () {
      if (!this.$refs.monster) return;
        return this.$refs.monster.clientWidth ? this.$refs.monster.clientWidth : 0
    },
    pHeight () {
      if (!this.$refs.monster) return;
        return this.$refs.monster.clientHeight ? this.$refs.monster.clientHeight : 0
    },
    egval () {
      if (this.selectEgg == 1) return 100;
      if (this.selectEgg == 2) return 400;
      if (this.selectEgg == 3) return 750;
      if (this.selectEgg == 4) return 1000;
      return 0;
    },
    egcos () {
      if (this.selectEgg == 1) return 200;
      if (this.selectEgg == 2) return 800;
      if (this.selectEgg == 3) return 1500;
      if (this.selectEgg == 4) return 1750;
      return 0;
    },
    predictSize () {
      return ( parseFloat(this.state.balance) + this.expectedYield ) / parseFloat(this.state.balance);
    },
    balance () {
      return (this.state.balance - 0).toFixed(8);
    },
    k () {
      return  (4 / Math.cos(this.angle/180*Math.PI) - 4) < 30 ? (4 / Math.cos(this.angle/180*Math.PI) - 4) : 30
    }
  },
  watch: {
    'state.oogles.length': {
      handler(val){
        this.$nextTick(() => {
          if (val != 0)   
            this.swiper.slideTo(state.game.currentOogleIdx)
        });
        
          //setTimeout(()=>,100)
      },
      deep: true
    },
    'state.oogles': {
      deep: true,
      handler: ()=>{}
    },
    'state.game': {
      handler(){

      },
      deep: true
    },
    'state.user': {
      handler(){
        console.debug('state.user', state)
      },
      deep: true
    },
    'state.isLoggedIn': () => {},
    'state.angle': function (val) {
      if (val){
        if (!this.touchPriority) this.angle = val;
        if (this.balance)
          this.expectedYield = this.balance*(1/Math.cos(this.angle/180*Math.PI) - 1)
        this.update_angle_color();
      }
    },
    'state.balance': function(val) {
        if (this.angle)
          this.expectedYield = val*(1/Math.cos(this.angle/180*Math.PI) - 1)
        this.lng = this.expectedYield / this.balance;
        this.size = (Math.max(this.balance/(this.convertToBnb2(100.0)),1)-1)/4 + 1;
    }
  },
  methods: {
    onboard() {
      this.$router.push('/onboarding')
    },
    goOgle () {
      this.$router.push('/eidol')
    },
    goBuy () {
      this.$router.push('/mageshop')
    },
    goForum () {
      this.$router.push('/forum')
    },
    goExtract () {
      this.$router.push('/extract')
    },
    goFeed () {
      this.$router.push('/feed')
    },
    goApple () {
      this.$router.push('/apple')
    },
    ref () {
      this.$router.push('/coop')
    },
    gdao () {
      this.$router.push('/gdaoshop')
    },
    send () {
      this.$router.push('/send')
    },
    exchange () {
      this.$router.push('/exchange')
    },
    onSwiper () {
    },
    onSlideChange () {
      if (!state.tutorial3Done) {
        this.isTutorial3 = false;
        state.tutorial3Done = true;
        window.localStorage.setItem('tutorial3-done',true)
      }
      console.log('MENU', this.swiper.activeIndex)
      state.game.currentOogleIdx = this.swiper.activeIndex;
      window.localStorage.setItem('menu-pos',state.game.currentOogleIdx)
    },
    convertToBnb (val) {
      if (val < 0) return '- ' + parseFloat(Math.abs(val)).toFixed(8);
      return parseFloat(val).toFixed(8);
    },
    convertToBnb2 (val) {
      return (parseFloat(val)  / 35886.34).toFixed(8);
    },
    getImgUrl(pet) {
      if (pet == null) return;
      var images = require.context('../assets/monsters/', false, /\.svg$/)
      //:src="'@/assets/monsters/'+state.oogle.skin+'.svg'"
      return images('./' + pet + ".svg")
    },
    getSkinUrl(pet) {
      if (pet == null) return;
      var images = require.context('../assets/investor/', false, /\.svg$/)
      //:src="'@/assets/monsters/'+state.oogle.skin+'.svg'"
      return images('./' + pet + ".svg")
    },
    depRight () {
      if (this.selectEgg < this.maxEgg) {
        this.selectEgg ++
      } else {
        this.selectEgg = 1
      }
      this.depLock = true;
    },
    depLeft () {
      if (this.selectEgg > 1) {
        this.selectEgg --
      } else {
        this.selectEgg = this.maxEgg
      }
      this.depLock = true;
    },
    logout() {
      axios
        .get(config.csrf)
        .then(() => {
          axios.post(
            `${config.api}/auth/logout`,
            {
            }
          ).then(() => {
      state.clearStorage();
            state.isLoggedIn = false;
            this.$router.replace('/hello')
          })
        })
    },
    wallet() {
      setTimeout(()=>{this.walletActive = !this.walletActive;},50)
    },
    closemenu() {
      if (this.walletActive) this.walletActive = !this.walletActive;
    },
    dep() {
      this.depActive = !this.depActive;
    },
    withd() {
      this.withActive = !this.withActive;
    },
    update_angle_color() {
      const f1 = Math.abs((this.angle - 45)/45);
      const f2 = 1 - f1;
      const f3 = (this.angle - 45)/45 > 0 ? (this.angle - 45)/45 : 0;
      const f4 = (45 - this.angle)/45 > 0 ? (45 - this.angle)/45 : 0;
      this.uiColor = '#' + parseInt(r1*f4 + r2*f2 + r3*f3 ).toString(16).padStart(2, '0')
                    + parseInt(g1*f4 + g2*f2 + g3*f3 ).toString(16).padStart(2, '0')
                    + parseInt(b1*f4 + b2*f2 + b3*f3 ).toString(16).padStart(2, '0');
    },
    place_bid() {
      if (this.state.game.isLocked) return;
      axios
        .get(config.csrf)
        .then(() => {
          axios.post(
            `${config.api}/game/join`,
            {
              "multiplier": this.expectedYield/this.balance + 1,
            }
          ).then(response => {
            setTimeout(utils.update_game(),5000);
            if (response.data.success) {
              this.state.isJoined = true;
            } else {
              console.warn(response)
            }
          })
        })
    },
    angleOntouchstart(evt) {
      if (this.state.game.isLocked || this.state.level == -1) return;
        this.originalAngle = this.angle;
        this.touchStartX = evt.touches[0].screenX
        this.touchStartY = evt.touches[0].screenY
        this.touchPriority = true;
    },
    angleOntouchmove(evt) {
      if (!this.moveStart) {
          //HIDE TIP
          this.moveStart = true;
          this.isTutorial = false;
          state.tutorialDone = true;
          window.localStorage.setItem('tutorial-done',true)
      }
      if (this.state.game.isLocked) return;
      evt.preventDefault();
      this.updateAngle(this.touchStartX, this.touchStartY, evt.touches[0].screenX, evt.touches[0].screenY)
      this.touchPriority = true;
      clearTimeout(this.timer)
    },
    angleOntouchend() {
        this.originalAngle = null;
        this.touchStartX = undefined
        this.touchStartY = undefined
        if (this.state.game.isLocked) return;
        this.place_bid()
        this.timer = setTimeout(()=>{this.touchPriority = false;},4000)
    },
    dOntouchstart(evt) {
        this.origCounter = this.dwCounter;
        this.touchStartX = evt.touches[0].screenX
        this.touchStartY = evt.touches[0].screenY
        this.touchPriority = true;
    },
    dOntouchmove(evt) {
      evt.preventDefault();
      if (this.isTutorial2) {
        this.isTutorial2 = false;
        state.tutorial2Done = true;
        window.localStorage.setItem('tutorial3-done',true)
      }
      this.updateCounter(this.touchStartX, this.touchStartY, evt.touches[0].screenX, evt.touches[0].screenY)
    },
    dOntouchend() {
        this.originalCounter = null;
        this.touchStartX = undefined
        this.touchStartY = undefined
        this.depLock = false;
    },
    updateCounter(startX, startY, endX, endY) {
      // const delta = (startY-endY) * 0.0005 * state.walletBalance
      // let counterDelta = Math.sign(delta) * 1.001 ** (Math.abs(delta)/1);
      const delta = startY-endY
      let deltaX = startX-endX
      if (this.depLock != true){
        if (deltaX > 0) this.depLeft()
          else this.depRight()
      }
      const multiplier = Math.sign(delta) * (1.3 ** (Math.abs(delta)/2e4)-1);
      this.dwCounter = Math.max(0, Math.min(this.dwCounter + Math.max(state.walletBalance, 1) * multiplier, state.walletBalance));
      // this.dwCounter = Math.min(state.walletBalance, Math.max(0, this.dwCounter+counterDelta));
      if (this.dwCounter > state.walletBalance) {
          this.dwCounter = state.walletBalance
      }

    },
    updateAngle(startX, startY, endX, endY) {
      //let depoDelta = (startY - endY)/1000;
      //this.deposit = Math.min(this.state.balance, Math.max(0, this.deposit+depoDelta));
      let angleDelta = (endX - startX)/500 + (startY - endY)/500;
      this.angle = Math.min(MaxAngle, Math.max(MinAngle, this.angle+angleDelta));
      this.lng = this.expectedYield / this.balance;
      // calc yield
      if (this.angle == 90.0) {
          this.expectedYield = "Inf"
      } else {
          this.expectedYield = this.balance/(90/this.angle)
      }
      const f1 = Math.abs((this.angle - 45)/45);
      const f2 = 1 - f1;
      const f3 = (this.angle - 45)/45 > 0 ? (this.angle - 45)/45 : 0;
      const f4 = (45 - this.angle)/45 > 0 ? (45 - this.angle)/45 : 0;
      this.uiColor = '#' + parseInt(r1*f4 + r2*f2 + r3*f3 ).toString(16).padStart(2, '0')
                    + parseInt(g1*f4 + g2*f2 + g3*f3 ).toString(16).padStart(2, '0')
                    + parseInt(b1*f4 + b2*f2 + b3*f3 ).toString(16).padStart(2, '0');
      // update graphics
    },
    onFrame() {
        if (this.expectedYield == 'Inf' || this.expectedYield == 0) {
            this.rdy = false;
        } else {
            this.rdy = true;
        }
        this.currentAnimId = window.requestAnimationFrame(this.onFrame);
    },
    deposite () {
      router.replace('/deposit')
    },
    withdraw () {
      router.replace('/withdraw')
    },
    back () {
      this.activity_state = 'idle';
    },
    copywallet() {
      this.isCopying = true;
      this.$clipboard(state.wallet.address)
      navigator.clipboard.writeText(state.wallet.address).then(function() {
        /* clipboard successfully set */
      }, function() {
        /* clipboard write failed */
      });
      setTimeout(()=>{this.isCopying = false},1000)
      // const shareData = {
      //   title: 'MDN',
      //   text: 'Learn web development on MDN!',
      //   url: 'https://developer.mozilla.org'
      // }
      // if (navigator) navigator.share(state.wallet.address)
    },
    activatewallet() {
      if (!state.user.start_gas) router.push('/startergas')
      else router.push('/starterbuy')
    },
    getCoin() {
      axios
        .get(config.csrf)
        .then(() => {
          axios
            .get(config.api+'/test-coin')
            .then(() => {
              alert("Test Coin Sent")
            }).catch(error => {
              this.error.message = error.response.data.message
            })
        })
    },
    back2 () {
      this.withActive = false;
      this.depActive = false;
      this.selectEgg = 1
      setTimeout(()=>{this.dwCounter = 0;this.isSuccessDW=false;},500);
    },
    submit () {

    },
    start_game () {
      this.activity_state = 'angle';
    },
    submitDeposit () {
      axios
        .get(config.csrf)
        .then(() => {
          axios
            .post(config.api+'/oogle/buy', {type: "egg" + this.selectEgg})
            .then(() => {
              this.isSuccessDW = true;
              setTimeout(()=>{utils.update_game();}, 750)
              setTimeout(()=>{this.back2();}, 250)
            }).catch(error => {
              this.error.message = error.response.data.message
            })
        })
    },
    submitWithdraw () {
      axios
        .get(config.csrf)
        .then(() => {
          axios
            .post(config.api+'/oogles/'+ state.oogle.id +'/pop', {})
            .then(() => {
              this.isSuccessDW = true;
              setTimeout(()=>{utils.update_game();}, 750)
              setTimeout(()=>{this.back2();}, 250)
            }).catch(error => {
              this.error.message = error.response.data.message
            })
        })
    },
    wOntouchstart(evt) {
        this.origCounter = this.dwCounter;
        this.touchStartX = evt.touches[0].screenX
        this.touchStartY = evt.touches[0].screenY
        this.touchPriority = true;
    },
    wOntouchmove(evt) {
      evt.preventDefault();
      this.updatewCounter(this.touchStartX, this.touchStartY, evt.touches[0].screenX, evt.touches[0].screenY)
    },
    wOntouchend() {
        this.originalCounter = null;
        this.touchStartX = undefined
        this.touchStartY = undefined
    },
    updatewCounter(startX, startY, endX, endY) {
      const delta = startY-endY
      const multiplier = Math.sign(delta) * (1.3 ** (Math.abs(delta)/2e4)-1);
      this.dwCounter = Math.max(0, Math.min(this.dwCounter + Math.max(state.balance, 1) * multiplier, state.balance));
      // this.dwCounter = Math.min(state.balance, Math.max(0, this.dwCounter+counterDelta));
      if (this.dwCounter > state.balance) {
          this.dwCounter = state.balance
      }
    },
  },
  mounted () {
    //utils.internal_clock();
    this.currentAnimId = window.requestAnimationFrame(this.onFrame);
    if (this.state.isJoined) {
      this.balance = this.state.balance;
      this.angle = this.state.angle;
      this.expectedYield = this.balance/Math.cos(this.angle/180*Math.PI) - this.balance
    }
    this.update_angle_color();
    if (this.isTutorial3) setTimeout(()=>{
      this.isTutorial3 = false;
    },5000)
  },
  filters: {
    toFixed8 (value) {
      return parseFloat(value).toFixed(8)
    }
  }
}
</script>

<style scoped>

.swiper-pagination-fraction, .swiper-pagination-custom {
  bottom: initial!important;
}

.swiper-pagination {
  text-align: left;
}

.left-menu-text, .left-menu-text a {
  color: #e5c44f;
  font-family: Rubik;
  font-weight: 400;
  font-size: 45px;
  margin-bottom: 40px;
  text-decoration: none;
}

.slide {
  width:  100%;
  height:  100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column-reverse;
  justify-content: flex-start;
  opacity: 0;
  transition: .3s ease all;
}
.slide.swiper-slide-active {
  opacity: 1;
}

.win {
  color: #e5c44f;
}
.win::before {
  content:  '+';
}
.lose {
  color: #ff8ee4;
}

.clock.locked {
  color: #ff8ee4;
}

.wall-c {
  overflow: hidden;
  width: 100%;
  position: absolute;
  height: 100%;
  background: white;
  right: -60%;
  z-index: 500;
  border-left: black 4px solid;
  transition: 1s all ease;
  -webkit-box-shadow: -6px 0px 8px 0px rgba(80, 73, 34, 0.25);
  -moz-box-shadow: -6px 0px 8px 0px rgba(80, 73, 34, 0.25);
  box-shadow: -6px 0px 8px 0px rgba(80, 73, 34, 0.25);
}

.wall-c.active {
  right: 0;
  border-left: black 0px solid;
  -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
}

.wall-c .header, .wall-c .tot-b, .wall-c .bot-h  {
  pointer-events: none;
}

.wall-c.active .header, .wall-c.active .tot-b, .wall-c.active .bot-h  {
  pointer-events: initial;
}

.cont {
  opacity: 0;
  transition: opacity .5s ease;
  width: 100%;
  position: fixed;
  height: 100%;
  pointer-events: none;
}

.cont.loaded {
  opacity: 1;
  pointer-events: initial!important;
}

.header {
  height: 100px;
  width: 100%;
  background: none;
  margin-top: 20px;
  display: block;
  position: relative;
  z-index: 1000;
}

.back-b {
  font-weight: 100;
  font-size: 30px;
  color: #000;
  font-family: Roboto;
  text-align: center;
  line-height: 80px;
  top: -10px;
  position: absolute;
  left: 20px;
}

.exit-b {
  font-weight: 100;
  font-size: 30px;
  color: #000;
  font-family: Roboto;
  text-align: center;
  line-height: 100px;
  top: 10px;
  position: absolute;
  left: 40px;
  opacity: 0;
  pointer-events: none;
  transition: .3s ease opacity;
}

.locked-button {
  border-color: #e5c44f!important;
  /*color: #ff8ee4!important;*/
  color: #e5c44f!important;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
}

.d-w-b {
  margin-top: 12px;
  height: 160px;
  width: 100%;
  background: none;
  transition: opacity .5s ease, max-height 1s ease;
  max-height: 160px;
  overflow: visible;
}

.d-w-b img {
  width: 60px;
}

.d-w-b div:first-of-type img {
  margin-right: 20px;
}

.d-w-b div {
  display: inline-block;
  width: calc(100% - 80px);
  height: 100%;
  position: relative;
  line-height: 144px;
  text-align: center;
  border: 5px solid;
  font-size: 46px;
  color: #000;
  font-family: Roboto;
  border-radius: 25px;
  font-weight: 400;
  -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);-moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
}

.losei {
    color: #ff8ee4!important;
  }

.d-w-b div:active {
  -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
}

.d-w-b div:first-of-type {
  /*margin-left: 40px;*/
  /*margin-right: 8px;*/
  border-color:  #e5c44f;
}

.d-w-b div:last-of-type {
  /*margin-right: 40px;*/
  /*margin-left: 8px;*/
  border-color:  black;
}

.d-w-b.locked {
  max-height: 0;
  pointer-events: none;
  -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
}

.d-w-b.locked div:first-of-type {
  /*border-color:  white;*/
}

.wall-h {
  text-align: center;
  width: 100%;
}
.wall-h span {
  color: #000;
  font-family: Roboto;
  font-weight: 300;
  font-size: 95px;
  line-height: 100px;
  white-space: nowrap;
  text-align: left;
}

.wall-h span:first-of-type {
  font-size: 46px;
}

.tot-b {
  margin-left: 80px;
  margin-right: 80px;
  width: calc(100% - 160px);
  position: relative;
  display: block;
  /*z-index: 100;*/
}

.tot-b .w-i {
  position: absolute;
  top: 0px;
  right: 0;
}

.bot-h {
  position: absolute;
  bottom: 20px;
  width: 100%;
}

.ctdwn {
  width: 100%;
    height: 160px;
    z-index: 501;
    position: relative;
    bottom: 0;
}

.ctdwn div {
  display: inline-block;
  height: 100%;
  position: relative;
  line-height: 150px;
  color: #e5c44f;
  font-family: 'Rubik';
  font-weight: 400;
}

.ctdwn div:first-of-type {
  text-align: left;
  float: left;
  margin-left: 80px;
  font-size: 50px;
}
.ctdwn div:last-of-type {
  text-align: right;
  float:  right;
  margin-right: 80px;
  font-size: 66px;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.angl-c {
  width: calc(100% - 160px);
  height: 920px;
  background: none;
  margin-left: 80px;
  margin-right: 80px;
  border-bottom: 5px solid black;
  margin-bottom: 40px;
  position: relative;
}

.w-i {
    position: absolute;
    bottom: 0px;
    right: 0px;
    color: black;
    font-family: 'Roboto';
    font-weight: 300;
    font-size: 60px;
    line-height: 80px;
    white-space: nowrap;
    text-align: right;
    margin-bottom: 30px;
    z-index: 202;
    transition: 1.5s ease opacity;
}

.w-i span:first-of-type {
  font-size: 46px;
}

.w-i-2 {
  position: relative;
    bottom: 40px;
    left: 0px;
    color: black;
    font-family: 'Roboto';
    font-weight: 300;
    font-size: 60px;
    line-height: 80px;
    white-space: nowrap;
    text-align: left;
    margin-bottom: 30px;
    top: 0;
    transition: 1.5s ease opacity;
}

.bot-h .w-i-2 {
  bottom: 80px!important;
  position: absolute;
  top: auto;
}

.w-i-2 span:first-of-type {
  font-size: 46px;
}

.cash {
  width: 40px;
  position: relative;
  bottom: 4px;
  left: 10px;
  margin-right: 12px;
}
.sw-t {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #ffffffbf;
  z-index: 301;
  pointer-events: none;
  transition: opacity .7s ease;
  opacity: 1;
}
.sw-t.disabled {
  opacity: 0;
}
.sw-t img.disabled {
  opacity: 0;
}

.sw-t img {
  margin: auto;
  display: block;
  height: 700px;
  position: absolute;
  top: calc(50% - 350px);
  transition: opacity .5s ease;
  opacity: 1;
  margin: 0 calc( (100% - 700px)/2 );
}

.swiper-pagination-line {
  width: 100%;
  position: absolute;
  bottom: -5px;
  display: flex;
}
</style>

<style>
  .home .swiper-pagination-bullet-active {
    width: 100%!important;
    border: none;
    background: #e5c44f!important;
    height: 5px;
    border-radius: 0!important;
  }

  .home .swiper-pagination-bullet {
    width: 100%!important;
    border: none;
    background: #000;
    height: 5px;
    border-radius: 0!important;
    opacity: 1!important;
  }
</style>
