const FourierService = {

    getConstantVectors: (points, maxFrequency, canvasRef) => {
        const translatedPoints = points.map(point => {
            return {t: point.t / points.length,
                    x: FourierService.transXToCenter(point.x, canvasRef),
                    y: FourierService.transYToCenter(point.y, canvasRef)}
        }) //Points' coordinates are translated into a cartesian plane for easier use

        let initialConstants = {}
        let frequencies = FourierService.getFrequencies(maxFrequency)

        frequencies.forEach(frequency => {     //frequency and -frequency must be calculated
                let multipliedPoints = translatedPoints.map(point => {
                    return FourierService.getProductWithEuler(point, -frequency * point.t)
                })  //All points are rotated in the oposite direction of the frequency so as to then obtain the
                    //initial constant vector

                //The "center of mass" of all points is calculated, and that will be the initial constant vector
                const sumX = multipliedPoints.map(point => point.x).reduce((prev, next) => prev + next)
                const sumY = multipliedPoints.map(point => point.y).reduce((prev, next) => prev + next)
                const meanX = sumX / multipliedPoints.length
                const meanY = sumY / multipliedPoints.length

                initialConstants[frequency] = {x: meanX, y: meanY}
            })

        return initialConstants

    },

    getProductWithEuler: (point, phi) => {
        const x = point.x * Math.cos(2 * Math.PI * phi) - point.y * Math.sin(2 * Math.PI * phi);
        const y = point.x * Math.sin(2 * Math.PI * phi) + point.y * Math.cos(2 * Math.PI * phi);
        return {x: x, y:y}
    },

    transXToCenter: (xCoordinate, canvasRef) => {
        return xCoordinate - (canvasRef.current.width / 4) //Divided by four as canvas is scaled by 2
    },

    transYToCenter: (yCoordinate, canvasRef) => {
        return - (yCoordinate - (canvasRef.current.height / 4)) ///Divided by four as canvas is scaled by 2
    },

    getFrequencies: (maxFrequency) => {
        let frequencies = [0]

        for (let frequency = 1; frequency <= maxFrequency; frequency++) {
            [1, -1].forEach(multiplier => {     //frequency and -frequency must be calculated
                frequencies.push(frequency * multiplier)
            })
        }

        return frequencies
    },

    getPolarForm: (vector) => {
        return {r: Math.sqrt(vector.x ** 2 + vector.y ** 2),
                theta: Math.atan2(vector.y, vector.x) }
    }

}

export default FourierService;