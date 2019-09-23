//
//  YQBNetWorkDemo.m
//  Demo2
//
//  Created by yidahis on 2019/7/30.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "YQBNetWorkDemo.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>
#import <SFGDatabaseModule/SFGURLCacheCenter.h>
#import <YQBUserCenterModule/YQBUserCenter.h>
#import <SFGSysCategory/SFGSysCategory.h>
#import <SFGNetRequestModule/SFGNetRequestModule.h>
#import <SFGGlobalConfig/YQBNetworkConfig.h>

@implementation YQBNetWorkDemo


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name details:(NSDictionary *)params)
{
  NSDate *date = [RCTConvert NSDate:params[@"date"]];
  NSString *location = [RCTConvert NSString:params[@"location"]];
  NSLog(@"date ==> %f", date.timeIntervalSince1970);
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_EXPORT_METHOD(applyHomeInfo:(RCTResponseSenderBlock)callback)
{
  //  NSArray *events = @[@"12323123"];
  
  [self applyHomeInfoWithSuccess:^(NSDictionary *dict) {
    callback(@[[NSNull null], @[dict]]);
  } failure:^(SFGApiError *error) {
    NSDictionary *dic = RCTMakeError(error.hintMessage, nil, nil);
    callback(@[dic, [NSNull null]]);
  }];
}

- (void)applyHomeInfoWithSuccess:(SFGCallbackBlockWithDictionary)success failure:(SFGCallbackBlockWithSFGApiError)failure {
  NSString *userId = [YQBUserCenter sharedUserCenter].user.userID;
  NSNumber *timeStamp = [NSDate getServerMicroSecondTimeStamp];
  NSMutableDictionary *params = [@{
                                   @"Timestamp" : timeStamp
                                   } mutableCopy];
  [params setObjectIgnoreNil:userId forKey:@"UserId"];
  
  NSMutableArray *signPairs = [@[@[@"Timestamp", timeStamp]] mutableCopy];
  if ([NSString isNotEmpty:userId]) {
    [signPairs addObject:@[@"UserId", userId]];
  }
  
  SFGApiUrl *apiObj = [[SFGApiUrl alloc] initWithApi:YQBApiV5PostLoanHomeInfo method:SFGHttpMethodPost version:SFGApiVersionV5 params:params signPairs:signPairs];
  
  [[SFGApiClient apiClient] requestWithApiObj:apiObj success:^(NSURLSessionTask *task, NSDictionary *response) {
    [SFGURLCacheCenter renewCachedData:YQBApiV5PostLoanHomeInfo response:response];
    NSDictionary *data = [response objectDictForKey:@"Data"];
    if (![NSDictionary isEmptyDict:data]) {
      if (success) {
        success(data);
      }
    }
  } failure:^(NSURLSessionTask *task, SFGApiError *error) {
    if (failure) {
      failure(error);
    }
  }];
}
@end

