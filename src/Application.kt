package net.opens3

import io.ktor.application.*
import io.ktor.client.HttpClient
import io.ktor.client.features.json.GsonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.routing.*
import io.ktor.gson.*
import io.ktor.http.content.*
import io.ktor.features.*
import io.ktor.features.ContentNegotiation
import io.ktor.html.respondHtml
import io.ktor.request.receive
import io.ktor.response.respond
import kotlinx.html.body


data class jsonReq(
    val url: String
)
data class SuccessStatus(val success: String, val value: Boolean)

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    install(Compression) {
        gzip {
            priority = 1.0
        }
        deflate {
            priority = 10.0
            minimumSize(1024) // condition
        }
    }

    install(AutoHeadResponse)

    install(ContentNegotiation) {
        gson {
        }
    }

    val client = HttpClient() {
        install(JsonFeature) {
            serializer = GsonSerializer()
        }
    }

    routing {
        post("/getJSON") {
            val thisReq = call.receive<jsonReq>()
            val req = khttp.get(thisReq.url)
            println(thisReq.url)
            if (req.statusCode == 200) {
                call.respond(req.jsonObject)
            } else {
                print(req.jsonObject)
                var stat = SuccessStatus("success", false)
                call.respond(stat)
            }
        }

        post("/getHTML") {
            val thisReq = call.receive<jsonReq>()
            val req = khttp.get(thisReq.url)
            println(thisReq.url)
            if (req.statusCode == 200) {
                call.respond(req.content)

            } else {
                call.respondHtml { body { +"Unsuccessful request" } }
            }
        }

        static("/") {
            // server with static files
            files("resources/static")
            // embedded server
            // resources("resources/static")

        }


    }
}

