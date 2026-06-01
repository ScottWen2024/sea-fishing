import os
b="D:/Fishing project/miniprogram/pages"

# WIKI
with open(b+"/wiki/wiki.wxml","w",encoding="utf-8") as f:
  f.write("""<view class="page" style="padding:0 20rpx;">
<block wx:for="{{list}}" wx:key="name">
<view class="card" style="margin-bottom:8rpx;display:flex;align-items:center;gap:16rpx;" bindtap="showDetail" data-idx="{{index}}">
<text style="font-size:44rpx;">{{item.icon}}</text>
<view style="flex:1;"><view style="font-weight:600;">{{item.name}}</view><view style="font-size:22rpx;color:var(--text-light);">{{item.alias}}</view></view>
<text style="color:var(--text-light);">></text>
</view></block>
</view>""")
print("wiki done")
