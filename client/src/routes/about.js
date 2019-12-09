import React from 'react';
import sharedStyles      from 'Styles/shared.css';

function About() {
  return (<div className={[sharedStyles.text_on_dark, sharedStyles.mild_text, sharedStyles.default_inset].join(' ')}>
            <h3>Det skall finnas en webbplats som är navigerbar och använder antingen Bootstrap,jQuery UI eller liknande för layout. Webbplatsen skall använda sig av god interaktionsdesign och vara användarvänlig. Beslut kring interaktion och design skall grundas i relevant dokumentation eller informationskällor. Webbplatsen skall använda sig utav de tekniker som använts i laborationerna, utöver detta skall ny kunskap förvärvas om andra tekniker som specifieras i nedanstående punkter. Testning av användargränssnittet skall ske med Selenium, testning av backend skall ske med Mocha (med istanbul). Alla huvudsakliga funktioner skall testas grundligt, studenten skall kunna motivera varför de valt att testa vissa data samt varför de beslutat att begränsa sig till denna data.
          Endast den nya informationen som efterfrågas av användaren skall uppdateras, minsta möjliga del av webbplatsen skall laddas om när användaren efterfrågar ny information.</h3>
            <ul>
              <li>Användare skall kunna registrera sig, logga in på en personlig sida samt logga ut. ✓ </li>
              <li>Användare skall kunna söka efter andra användare. ✓ </li>
              <li>Användare skall kunna lägga till andra användare som vänner. ✓ </li>
              <li>Användare skall kunna se en lista över sina vänner. ✓ </li>
              <li>Användare skall kunna se sina vänners sidor. ✓ </li>
              <li>Användare skall kunna posta meddelanden på sina vänners sidor. ✓ </li>
              <li>Alla formulär skall valideras på klienten, antingen med JavaScript som i laborationerna eller med nya HTML5 attribut. ✓ </li>
            </ul>
          </div>);
}


export default About;