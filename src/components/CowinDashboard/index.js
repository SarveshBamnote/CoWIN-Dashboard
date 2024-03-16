import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccineCoverage: [],
    vaccineByAge: [],
    vaccineByGender: [],
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const updatedVaccineCoverage = data.last_7_days_vaccination.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      const updatedVaccineByAge = data.vaccination_by_age
      const updatedVaccineByGender = data.vaccination_by_gender

      this.setState({
        vaccineCoverage: updatedVaccineCoverage,
        vaccineByAge: updatedVaccineByAge,
        vaccineByGender: updatedVaccineByGender,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderCowinDashboardView = () => {
    const {vaccineCoverage, vaccineByGender, vaccineByAge} = this.state
    return (
      <>
        <VaccinationCoverage lastSevenDaysData={vaccineCoverage} />
        <VaccinationByGender vaccineByGender={vaccineByGender} />
        <VaccinationByAge vaccineByAge={vaccineByAge} />
      </>
    )
  }

  renderCowinDashboard = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCowinDashboardView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination In India</h1>
          {this.renderCowinDashboard()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
