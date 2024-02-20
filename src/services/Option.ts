const getSurveys = () => {
    await connection.manager.find(Survey)
}