/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    TextInput,
    Keyboard,
    NativeModules
} from 'react-native';

import {Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions} from 'react-native/Libraries/NewAppScreen';

class RNComponent extends React.Component {
    constructor(props) {
        super(props)
        this.rnRequest = this
            .rnRequest
            .bind(this);
        this.originRequest = this
            .originRequest
            .bind(this);
        this.clear = this
            .clear
            .bind(this);
        this.changeTestCount = this
            .changeTestCount
            .bind(this);

        this.state = {
            rnText: 'rn请求结果\n',
            originText: '原生请求结果\n',
            testCount: 0,
            txtValue: ''
        };

    };

    render() {
        return (
            <ScrollView >
                <View >
                    <Button
                        style={{
                        justifyContent: 'center'
                    }}
                        title='清除所有'
                        onPress={this.clear}/>
                    <View
                        style={{
                        flexDirection: 'row'
                    }}>
                        <TextInput
                            defaultValue={String(this.state.testCount)}
                            ref='textInputRefer'
                            onChangeText={(text) => {
                            this.state.txtValue = text;
                        }}
                            style={{
                            marginLeft: 15,
                            width: 100,
                            borderBottomColor: 'gray',
                            borderBottomWidth: 1
                        }}/>
                        <Button title='修改次数' onPress={this.changeTestCount}/>
                    </View>

                    <View
                        style={{
                        marginTop: 40,
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            flex: 1,
                        }}>

                            <Button
                                style={{
                                
                            }}
                                title='rn请求'
                                onPress={() => {
                                return this.rnRequest(0, 0)
                            }}/>
                            <Text style={{marginLeft: 10}}>
                                {this.state.rnText}
                            </Text>
                        </View>
                        <View style={{
                            flex: 1
                        }}>
                            <Button
                                style={{
                                
                            }}
                                title='调用原生请求'
                                onPress={() => {
                                return this.originRequest(0, 0)
                            }}/>
                            <Text >
                                {this.state.originText}
                            </Text>
                        </View>

                    </View>

                </View>
            </ScrollView>
        )
    }

    changeTestCount() {}

    rnRequest(count : Int, time : Int) {
        console.log('count ==> ' + count);
        if (count >= this.state.testCount) {
            return;
        }

        const aHeaders = new Headers();
        aHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
        aHeaders.append('ApiKey', '0vT4R7BF7ziw2xs5DfO5BD9d5LO9GuIBJ7F851Ve898'); //必须
        // aHeaders.append('Channel', 'app-store'); aHeaders.append('DeviceId',
        // 'FFA53222-1CDD-4D52-8634-AF0BA1DBFA14');
        aHeaders.append('Version', '5.8.0'); //必须
        aHeaders.append('SystemInfo', 'iOS12.1.1'); //必须
        // aHeaders.append('AnubisDeviceId',
        // 'ffa53222-1cdd-4d52-8634-af0ba1dbfa14-1101'); aHeaders.append('AuthCode',
        // '1'); aHeaders.append('SessionID', '2'); aHeaders.append('User-Agent',
        // 'YongQianBao/5.8.0 (iPhone; iOS 12.1.1; Scale/3.00)');
        // aHeaders.append('Cookie', 'csrftoken=IbaERM7ip8zAb8ynfOx1uTaVEsLEqZlc');
        // aHeaders.append('X-Tingyun-Id', 'h--YAsd90cs;c=2;r=1292819479');
        aHeaders.append('Sign', 'b6cd7f70b2782308221b45cdeea6f446'); //必须，详情请见 SFGApiUrl 116行

        const request = new Request('http://192.168.6.190:19010/api/v5/index', {
            method: 'POST',
            body: '{"Timestamp":"1564480950686.848"}',
            headers: aHeaders
        });
        const date = new Date().getTime();
        fetch(request).then((response) => response.json()).then((responseJson) => {
            console.log('responseJson ==> ');
            console.log(responseJson);
            const newDate = new Date().getTime();
            const daltaTime = newDate - date;
            const totlaTime = time + daltaTime;
            console.log(newDate - date);
            count++;
            this.setState(previousState => {
                return {
                    rnText: previousState.rnText + 'c->' + count + ', t->' + totlaTime + ', d->' + daltaTime + '\n'
                };
            });
            console.log('all time => ' + totlaTime);
            this.rnRequest(count, totlaTime);
        }).catch((error) => {
            console.error(error);
            alert('请求失败');
        });;
    }

    originRequest(count : Int, time : Int) {

        console.log('count ==> ' + count);
        if (count >= this.state.testCount) {
            return;
        }
        const demo = NativeModules.YQBNetWorkDemo;
        const date = new Date().getTime();
        demo.applyHomeInfo((error, responseJson) => {

            if (error) {
                console.log(error);
                alert('请求失败' + error);
            } else {
                console.log(responseJson);
                console.log('responseJson ==> ');
                console.log(responseJson);
                const newDate = new Date().getTime();
                const daltaTime = newDate - date;
                const totlaTime = time + daltaTime;
                console.log(newDate - date);
                count++;

                this.setState(previousState => {
                    return {
                        originText: previousState.originText + 'c->' + count + ', t->' + totlaTime + ', d->' + daltaTime + '\n'
                    };
                });

                console.log('all time => ' + totlaTime);
                this.originRequest(count, totlaTime);
            }
        });

        console.log('调用原生请求');
    }

    changeTestCount() {
        Keyboard.dismiss();
        this.setState({testCount: this.state.txtValue});
    }

    clear() {
        this.setState({rnText: 'rn请求结果\n', originText: '原生请求结果\n'})
    }
}

const App = () => {
    const demo = NativeModules.YQBNetWorkDemo;
    const date = new Date();
    demo.addEvent('Birthday Party', {
        location: 'gui zhou zun yi',
        date: date.getTime()
    });

    return (
        <Fragment>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView>
                <View>
                    <RNComponent style={{
                        flex: 1
                    }}/>
                </View>

            </SafeAreaView>
        </Fragment>
    );

};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter
    },
    engine: {
        position: 'absolute',
        right: 0
    },
    body: {
        backgroundColor: Colors.white
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark
    },
    highlight: {
        fontWeight: '700'
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right'
    }
});

export default App;
