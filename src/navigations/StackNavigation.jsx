import {createStackNavigator} from '@react-navigation/stack'
import WelcomeScreen from '../screens/WelcomeScreen'
import SplashScreen from '../screens/SplashScreen'
import LoginScreen from '../screens/LoginScreen'
import AccoutTypeScreen from '../screens/AcountTypeScreen'
import PersonalInformationScreen from '../screens/PersonalInformationScreen'
import SignupScreen from '../screens/SignupScreen'
import SkillsScreen from '../screens/SkillsScreen'
import WorkSampleScreen from '../screens/WorkSampleScreen'
import ShowImageScreen from '../screens/ShowImageScreen'
import ConfirmAndRegisterScreen from '../screens/ConfirmAndRegisterScreen'
import TabNavigator from './TabNavigator'
import JobDetailsScreen from '../screens/JobDetailsScreen'
import WorkerProfileScreen from '../screens/WorkerProfileScreen'
import RequestsScreen from '../screens/RequestsScreen'
import EmployerProfile from '../screens/EmployerProfile'
import EditProfileScreen from '../screens/EditProflieScreen'
import SettingsScreen from '../screens/SettingsScreen'
import MyJobsScreen from '../screens/MyJobsScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import { NotificationProvider } from '../contexts/NotificationContext'


export default function StackNavigation() {
    const Stack = createStackNavigator()

    return(
        <NotificationProvider>
        <Stack.Navigator screenOptions={{
            headerShown : false
        }}>
            <Stack.Screen name='splash' component={SplashScreen}/>
            <Stack.Screen name='welcome' component={WelcomeScreen}/>
            <Stack.Screen name='acountType' component={AccoutTypeScreen}/>
            <Stack.Screen name='login' component={LoginScreen}/>
            <Stack.Screen name='signup' component={SignupScreen}/>
            <Stack.Screen name='personalInformation' component={PersonalInformationScreen}/>
            <Stack.Screen name='skills' component={SkillsScreen}/>
            <Stack.Screen name='showImage' component={ShowImageScreen}/>
            {/* <Stack.Screen name='location' component={LocationScreen}/> */}
            <Stack.Screen name='workSample' component={WorkSampleScreen}/>
            <Stack.Screen name='confirmAndRegister' component={ConfirmAndRegisterScreen}/>
            <Stack.Screen name='MainTab' component={TabNavigator}/>
            <Stack.Screen name='jobDetails' component={JobDetailsScreen}/>
            <Stack.Screen name='workerProflile' component={WorkerProfileScreen}/>
            <Stack.Screen name='myJobs' component={MyJobsScreen}/>
            <Stack.Screen name='requests' component={RequestsScreen}/>
            <Stack.Screen name='employerProfile' component={EmployerProfile}/>
            <Stack.Screen name='editProfile' component={EditProfileScreen}/>
            <Stack.Screen name='settings' component={SettingsScreen}/>
            <Stack.Screen name='notifications' component={NotificationsScreen}/>

        </Stack.Navigator>
        </NotificationProvider>
    )
}